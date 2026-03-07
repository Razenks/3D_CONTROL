<?php

namespace App\Http\Controllers;

use App\Models\Orcamento;
use App\Models\Impressao;
use App\Models\Produto;
use App\Models\Material;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RelatorioController extends Controller
{
    public function index(Request $request)
    {
        $periodo = $request->query('periodo', 30);
        $tipo = $request->query('tipo', 'geral'); // geral, material, vendas, orcamentos
        $startDate = Carbon::now()->subDays($periodo);

        $response = [
            'periodo' => $periodo,
            'tipo' => $tipo,
            'stats' => [],
            'detalhes' => []
        ];

        if ($tipo === 'geral') {
            $statsOrcamentos = Orcamento::where('created_at', '>=', $startDate)
                ->whereIn('status', ['Aprovado', 'Finalizado', 'Pago'])
                ->select(DB::raw('SUM(valor_total) as faturamento'), DB::raw('SUM(lucro_estimado) as lucro'))->first();

            $statsImpressoes = Impressao::where('created_at', '>=', $startDate)
                ->where('status', 'concluido')
                ->select(DB::raw('SUM(peso_estimado) as consumo_gramas'), DB::raw('COUNT(*) as total_impressoes'))->first();

            $response['stats'] = [
                'faturamento' => 'R$ ' . number_format($statsOrcamentos->faturamento ?? 0, 2, ',', '.'),
                'lucro' => 'R$ ' . number_format($statsOrcamentos->lucro ?? 0, 2, ',', '.'),
                'consumoMaterial' => number_format(($statsImpressoes->consumo_gramas ?? 0) / 1000, 2, ',', '.') . 'kg',
                'totalImpressoes' => $statsImpressoes->total_impressoes ?? 0,
            ];

            $response['topProdutos'] = Orcamento::where('created_at', '>=', $startDate)
                ->whereIn('status', ['Aprovado', 'Finalizado', 'Pago'])
                ->select('projeto as nome', DB::raw('COUNT(*) as qtd'), DB::raw('SUM(valor_total) as faturamento'))
                ->groupBy('projeto')->orderBy('qtd', 'desc')->limit(5)->get();
        } 
        
        else if ($tipo === 'material') {
            $consumoPorMaterial = Impressao::where('impressoes.created_at', '>=', $startDate)
                ->where('impressoes.status', 'concluido')
                ->join('orcamentos', 'impressoes.orcamento_id', '=', 'orcamentos.id')
                ->select(
                    DB::raw("orcamentos.detalhes_calculo->>'material' as material"), 
                    DB::raw('SUM(impressoes.peso_estimado) as total_peso')
                )
                ->groupBy(DB::raw("orcamentos.detalhes_calculo->>'material'"))->get();
            
            $response['detalhes'] = $consumoPorMaterial;
            $response['stats'] = [
                'total_consumo' => number_format($consumoPorMaterial->sum('total_peso') / 1000, 2, ',', '.') . 'kg'
            ];
        }

        else if ($tipo === 'orcamentos') {
            $statusCounts = Orcamento::where('created_at', '>=', $startDate)
                ->select('status', DB::raw('COUNT(*) as total'), DB::raw('SUM(valor_total) as valor'))
                ->groupBy('status')->get();
            
            $response['detalhes'] = $statusCounts;
        }

        return response()->json($response);
    }
}
