<?php

namespace App\Http\Controllers;

use App\Models\Impressao;
use App\Models\Material;
use App\Models\Orcamento;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImpressaoController extends Controller
{
    protected $columns = [
        'id', 'impressora_id', 'orcamento_id', 'material_id', 'cliente_id',
        'status', 'progresso', 'quantidade', 'quantidade_concluida',
        'data_inicio', 'data_fim', 'projeto_nome', 'peso_estimado',
        'tempo_estimado', 'detalhes_tecnicos', 'created_at', 'updated_at'
    ];

    public function index()
    {
        $impressoes = Impressao::select($this->columns)
            ->with(['impressora', 'material.cor', 'material.marca', 'cliente'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($impressoes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'impressora_id' => 'required',
            'orcamento_id' => 'nullable',
            'material_id' => 'required',
            'cliente_id' => 'nullable',
            'projeto_nome' => 'required|string',
            'peso_estimado' => 'required|numeric|min:0',
            'tempo_estimado' => 'nullable|string',
            'quantidade' => 'nullable|integer|min:1',
            'status' => 'sometimes|string'
        ]);

        try {
            $impressoraId = (int)$validated['impressora_id'];
            $materialId = (int)$validated['material_id'];
            $orcamentoId = (!empty($validated['orcamento_id']) && $validated['orcamento_id'] !== '') ? (int)$validated['orcamento_id'] : null;
            $clienteId = (!empty($validated['cliente_id']) && $validated['cliente_id'] !== '') ? (int)$validated['cliente_id'] : null;
            
            $pesoUnidade = (float)$validated['peso_estimado'];
            $quantidade = (int)($validated['quantidade'] ?? 1);
            $pesoTotal = $pesoUnidade * $quantidade;

            $material = DB::table('materials')->where('id', $materialId)->first();
            if (!$material) throw new \Exception("Material não encontrado.");
            if ($material->quantidade_restante < $pesoTotal) {
                throw new \Exception("Estoque insuficiente! Disponível: {$material->quantidade_restante}{$material->unidade}");
            }

            $query = 'INSERT INTO impressoes (
                impressora_id, orcamento_id, material_id, cliente_id, 
                projeto_nome, peso_estimado, tempo_estimado, quantidade, 
                quantidade_concluida, status, progresso, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';

            DB::insert($query, [
                $impressoraId, $orcamentoId, $materialId, $clienteId,
                $validated['projeto_nome'], $pesoUnidade, $validated['tempo_estimado'] ?? '0h 0m',
                $quantidade, 0, $validated['status'] ?? 'fila', 0
            ]);

            DB::table('materials')->where('id', $materialId)->decrement('quantidade_restante', $pesoTotal);

            return response()->json(['message' => 'Sucesso!'], 201);
            
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage(), 'error' => true], 400);
        }
    }

    public function show($id)
    {
        $impressao = Impressao::select($this->columns)->with(['impressora', 'orcamento', 'material', 'cliente'])->findOrFail($id);
        return response()->json($impressao);
    }

    public function update(Request $request, $id)
    {
        $impressao = Impressao::select($this->columns)->findOrFail($id);
        $validated = $request->validate([
            'status' => 'sometimes|string',
            'progresso' => 'sometimes|integer|min:0|max:100',
            'increment_qty' => 'nullable|integer|min:1',
            'peso_perdido' => 'nullable|numeric'
        ]);

        try {
            return DB::transaction(function () use ($validated, $impressao) {
                if (isset($validated['increment_qty'])) {
                    $qtdAdicional = (int)$validated['increment_qty'];
                    $novaQtdConcluida = (int)($impressao->quantidade_concluida ?? 0) + $qtdAdicional;
                    
                    $totalLote = (int)($impressao->quantidade ?? 1);
                    if ($totalLote <= 0) $totalLote = 1;

                    if ($novaQtdConcluida > $totalLote) {
                        throw new \Exception("Quantidade excede o total do lote ($totalLote).");
                    }

                    $impressao->quantidade_concluida = $novaQtdConcluida;
                    $impressao->progresso = (int)(($novaQtdConcluida / $totalLote) * 100);

                    if ($novaQtdConcluida == $totalLote) {
                        $impressao->status = 'concluido';
                        $impressao->data_fim = now();
                    } else {
                        $impressao->status = 'imprimindo';
                    }

                    // --- ENTRADA AUTOMÁTICA NO ESTOQUE DE PRODUTOS ---
                    $horasDec = 0;
                    if ($impressao->tempo_estimado) {
                        preg_match('/(\d+)h/', $impressao->tempo_estimado, $h);
                        preg_match('/(\d+)m/', $impressao->tempo_estimado, $m);
                        $horasDec = (float)($h[1] ?? 0) + ((float)($m[1] ?? 0) / 60);
                    }

                    $materialData = [];
                    if ($impressao->material_id) {
                        $mat = Material::with(['cor', 'marca'])->find($impressao->material_id);
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
                    $margemSugerida = 250; // Padrão caso não haja orçamento
                    
                    if ($impressao->orcamento_id) {
                        $orc = Orcamento::find($impressao->orcamento_id);
                        if ($orc) {
                            $detalhes = $orc->detalhes_calculo; 
                            $qtdOrc = (int)($detalhes['quantidade'] ?? 1);
                            if ($qtdOrc <= 0) $qtdOrc = 1;

                            // Custo de material unitário
                            $custoUnidade = (float)$orc->custo_estimado / $qtdOrc;
                            
                            // Se o orçamento já tem um valor total, vamos calcular a "margem real" 
                            // que foi usada para que o preço de venda no estoque bata com o orçamento.
                            // Preço Venda = Custo * (1 + Margem/100)
                            // Logo: Margem = ((Preço Venda / Custo) - 1) * 100
                            if ($custoUnidade > 0) {
                                $precoVendaUnidade = (float)$orc->valor_total / $qtdOrc;
                                $margemSugerida = (($precoVendaUnidade / $custoUnidade) - 1) * 100;
                            }
                        }
                    }

                    Produto::create(array_merge([
                        'nome' => $impressao->projeto_nome,
                        'quantidade' => $qtdAdicional,
                        'data_fabricacao' => now()->format('Y-m-d'),
                        'custo_material' => (float)$custoUnidade,
                        'tempo_horas' => (float)$horasDec,
                        'margem_lucro' => (int)$margemSugerida,
                        'ativo' => DB::raw('true'),
                    ], $materialData));
                }

                if (isset($validated['status'])) $impressao->status = $validated['status'];
                if (isset($validated['progresso']) && !isset($validated['increment_qty'])) {
                    $impressao->progresso = $validated['progresso'];
                }

                if ($impressao->status === 'falha' && !empty($validated['peso_perdido']) && $validated['peso_perdido'] > 0) {
                    if ($impressao->material_id) {
                        DB::table('materials')->where('id', $impressao->material_id)->decrement('quantidade_restante', $validated['peso_perdido']);
                    }
                }

                $impressao->save();
                return response()->json($impressao);
            });
        } catch (\Exception $e) {
            Log::error("ImpressaoController::update ERROR: " . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        $impressao = Impressao::select($this->columns)->findOrFail($id);
        $impressao->delete();
        return response()->json(['message' => 'Removido com sucesso.']);
    }

    public function getAvailableOrcamentos()
    {
        $orcamentosEmImpressao = Impressao::whereNotNull('orcamento_id')->pluck('orcamento_id');
        return response()->json(Orcamento::where('status', 'Aprovado')->whereNotIn('id', $orcamentosEmImpressao)->orderBy('created_at', 'desc')->get());
    }
}
