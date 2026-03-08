<?php

namespace App\Http\Controllers;

use App\Models\Impressora;
use App\Models\Impressao;
use App\Models\Produto;
use App\Models\Orcamento;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class ImpressoraController extends Controller
{
    /**
     * Check real-time status of the printer via IP.
     */
    public function checkStatus($id)
    {
        $impressora = Impressora::findOrFail($id);
        
        if (!$impressora->ip_local) {
            return response()->json(['status' => 'offline', 'message' => 'IP não configurado.'], 400);
        }

        $ip = $impressora->ip_local;
        
        $endpoints = [
            "http://{$ip}/printer/info",
            "http://{$ip}:7125/printer/info",
            "http://{$ip}/api/version",
            "http://{$ip}/"
        ];

        foreach ($endpoints as $url) {
            try {
                $response = Http::timeout(2)->get($url);
                if ($response->successful()) {
                    $impressora->update(['status_atual' => 'online']);
                    return response()->json([
                        'status' => 'online', 
                        'message' => 'Impressora conectada com sucesso!'
                    ]);
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        $impressora->update(['status_atual' => 'offline']);
        return response()->json([
            'status' => 'offline', 
            'message' => "Não foi possível alcançar a impressora no IP {$ip}."
        ], 503);
    }

    public function getCurrentPrint($id)
    {
        $impressora = Impressora::findOrFail($id);
        if (!$impressora->ip_local) return response()->json(['error' => 'IP não configurado'], 400);

        $ip = $impressora->ip_local;
        
        try {
            $response = Http::timeout(3)->get("http://{$ip}/printer/objects/query?print_stats&display_status&heater_bed&extruder");
            
            if ($response->successful()) {
                $result = $response->json()['result']['status'] ?? null;
                
                if ($result) {
                    $filename = $result['print_stats']['filename'] ?? null;
                    $state = $result['print_stats']['state'] ?? 'standby';
                    $progresso = isset($result['display_status']['progress']) ? round($result['display_status']['progress'] * 100, 1) : 0;

                    // --- LÓGICA DE AUTOMAÇÃO DE PRODUÇÃO ---
                    $impressaoAtiva = Impressao::where('impressora_id', $id)
                        ->where('gcode_filename', $filename)
                        ->whereIn('status', ['imprimindo', 'pausado', 'fila'])
                        ->first();

                    if ($impressaoAtiva) {
                        if ($state === 'printing' && $impressaoAtiva->status !== 'imprimindo') {
                            $impressaoAtiva->update(['status' => 'imprimindo', 'data_inicio' => now()]);
                        }

                        // DETECTOU QUE TERMINOU UM CICLO
                        if ($state === 'standby' && $impressaoAtiva->status === 'imprimindo') {
                            
                            DB::transaction(function() use ($impressaoAtiva) {
                                // 1. Incrementa quantidade concluída
                                $impressaoAtiva->increment('quantidade_concluida');
                                
                                // 2. ENTRADA NO ESTOQUE DE PRODUTOS
                                $horasDec = 0;
                                if ($impressaoAtiva->tempo_estimado) {
                                    preg_match('/(\d+)h/', $impressaoAtiva->tempo_estimado, $h);
                                    preg_match('/(\d+)m/', $impressaoAtiva->tempo_estimado, $m);
                                    $horasDec = (float)($h[1] ?? 0) + ((float)($m[1] ?? 0) / 60);
                                }

                                $materialData = [];
                                if ($impressaoAtiva->material_id) {
                                    $mat = Material::with(['cor', 'marca'])->find($impressaoAtiva->material_id);
                                    if ($mat) {
                                        $materialData = [
                                            'material_id' => $mat->id,
                                            'material_nome' => $mat->marca->nome ?? 'Genérico',
                                            'material_cor' => $mat->cor->nome ?? 'N/A',
                                            'material_hex_cor' => $mat->cor->hex ?? '#000000'
                                        ];
                                    }
                                }

                                $custoUnidade = 0;
                                $margemSugerida = 250;
                                if ($impressaoAtiva->orcamento_id) {
                                    $orc = Orcamento::find($impressaoAtiva->orcamento_id);
                                    if ($orc && $orc->custo_estimado > 0) {
                                        $detalhes = $orc->detalhes_calculo;
                                        $qtdOrc = (int)($detalhes['quantidade'] ?? 1);
                                        $custoUnidade = (float)$orc->custo_estimado / $qtdOrc;
                                        $precoVendaUn = (float)$orc->valor_total / $qtdOrc;
                                        $margemSugerida = (($precoVendaUn / $custoUnidade) - 1) * 100;
                                    }
                                }

                                Produto::create(array_merge([
                                    'nome' => $impressaoAtiva->projeto_nome,
                                    'quantidade' => 1,
                                    'data_fabricacao' => now()->format('Y-m-d'),
                                    'custo_material' => (float)$custoUnidade,
                                    'tempo_horas' => (float)$horasDec,
                                    'margem_lucro' => (int)$margemSugerida,
                                    'ativo' => true,
                                ], $materialData));

                                // 3. Atualiza status da fila
                                if ($impressaoAtiva->quantidade_concluida >= $impressaoAtiva->quantidade) {
                                    $impressaoAtiva->update(['status' => 'concluido', 'data_fim' => now(), 'progresso' => 100]);
                                } else {
                                    $impressaoAtiva->update(['status' => 'fila', 'progresso' => 0]);
                                }
                            });
                        }
                        
                        if ($state === 'printing') {
                            $impressaoAtiva->update(['progresso' => $progresso]);
                        }
                    }

                    return response()->json([
                        'filename' => $filename ?? 'Desconhecido',
                        'status' => $state,
                        'progresso' => $progresso,
                        'temp_extrusora' => $result['extruder']['temperature'] ?? 0,
                        'temp_mesa' => $result['heater_bed']['temperature'] ?? 0,
                    ]);
                }
            }

            // Fallback simplificado
            $respStatus = Http::timeout(2)->get("http://{$ip}/printer/info");
            if ($respStatus->successful()) {
                return response()->json([
                    'filename' => 'Imprimindo...',
                    'status' => 'printing',
                    'progresso' => 0,
                    'temp_extrusora' => 0,
                    'temp_mesa' => 0,
                ]);
            }

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 503);
        }

        return response()->json(['status' => 'standby', 'filename' => 'Nenhum']);
    }

    public function getFiles($id)
    {
        $impressora = Impressora::findOrFail($id);
        if (!$impressora->ip_local) return response()->json(['error' => 'IP não configurado'], 400);

        $ip = $impressora->ip_local;
        
        try {
            $response = Http::timeout(5)->get("http://{$ip}/server/files/list?root=gcodes");
            
            if ($response->successful()) {
                $files = $response->json()['result'] ?? [];
                
                $formattedFiles = array_map(function($file) use ($ip) {
                    return [
                        'name' => $file['path'],
                        'size' => round($file['size'] / 1024 / 1024, 2) . ' MB',
                        'modified' => date('d/m/Y H:i', (int)$file['modified']),
                        'thumbnail' => isset($file['thumbnails']) ? end($file['thumbnails'])['relative_path'] : null,
                        'printer_ip' => $ip
                    ];
                }, $files);

                usort($formattedFiles, function($a, $b) {
                    return strtotime(str_replace('/', '-', $b['modified'])) - strtotime(str_replace('/', '-', $a['modified']));
                });

                return response()->json($formattedFiles);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 503);
        }

        return response()->json(['error' => 'Impressora não respondeu'], 503);
    }

    public function proxyImage(Request $request, $id)
    {
        $impressora = Impressora::findOrFail($id);
        $path = $request->query('path');
        
        if (!$path || !$impressora->ip_local) return response()->json(['error' => 'Parâmetros inválidos'], 400);

        try {
            $url = "http://{$impressora->ip_local}/server/files/gcodes/{$path}";
            $response = Http::timeout(5)->get($url);

            if ($response->successful()) {
                return response($response->body())
                    ->header('Content-Type', $response->header('Content-Type') ?: 'image/png');
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao carregar imagem'], 500);
        }

        return response()->json(['error' => 'Imagem não encontrada'], 404);
    }

    public function startPrint(Request $request, $id)
    {
        $impressora = Impressora::findOrFail($id);
        $filename = $request->input('filename');

        if (!$filename || !$impressora->ip_local) {
            return response()->json(['error' => 'Parâmetros inválidos'], 400);
        }

        try {
            $url = "http://{$impressora->ip_local}/printer/print/start";
            $response = Http::timeout(5)->post($url, [
                'filename' => $filename
            ]);

            if ($response->successful()) {
                $impressora->update(['status_atual' => 'imprimindo']);
                return response()->json(['message' => 'Impressão iniciada com sucesso!']);
            }
            
            return response()->json([
                'error' => 'A impressora recusou o comando.',
                'details' => $response->json()
            ], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 503);
        }
    }

    public function index(Request $request)
    {
        $query = Impressora::orderBy('nome');
        if ($request->has('ativos_only')) {
            $query->where('ativo', true);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string',
            'modelo' => 'required|string',
            'ip_local' => 'nullable|string',
            'tipo_conexao' => 'required|string|in:manual,klipper,octoprint',
        ]);

        $impressora = Impressora::create($validated);

        return response()->json($impressora, 201);
    }

    public function show($id)
    {
        return response()->json(Impressora::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $impressora = Impressora::findOrFail($id);
        
        $validated = $request->validate([
            'nome' => 'sometimes|string',
            'modelo' => 'sometimes|string',
            'ip_local' => 'nullable|string',
            'tipo_conexao' => 'sometimes|string|in:manual,klipper,octoprint',
            'status_atual' => 'sometimes|string',
        ]);

        $impressora->update($validated);

        return response()->json($impressora);
    }

    public function destroy($id)
    {
        $impressora = Impressora::findOrFail($id);
        $impressora->delete();

        return response()->json(['message' => 'Impressora removida com sucesso!']);
    }
}
