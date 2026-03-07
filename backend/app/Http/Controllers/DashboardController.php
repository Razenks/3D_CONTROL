<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Produto;
use App\Models\Orcamento;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get summary statistics for the home screen.
     */
    public function index()
    {
        // Contagens básicas
        $orcamentosPendentes = Orcamento::whereIn('status', ['Aguardando Análise', 'Precificando'])->count();
        $produtosEstoque = Produto::whereRaw('ativo = true')->where('quantidade', '>', 0)->count();
        
        // Materiais com estoque baixo (ex: menos de 400g ou 400ml) e que ainda estejam ativos
        $materiaisCriticos = Material::whereRaw('ativo = true')
            ->where('quantidade_restante', '<=', 400)
            ->orderBy('quantidade_restante', 'asc')
            ->get();

        $alertaCriticoCount = $materiaisCriticos->where('quantidade_restante', '<=', 200)->count();

        // Por enquanto, pedidos e impressões serão valores simulados 
        // até criarmos a tabela de Impressões
        $pedidosFila = 0; // Futura tabela de Impressões
        $concluidosSemana = 0; // Futura tabela de Impressões

        return response()->json([
            'stats' => [
                'pedidos_fila' => $pedidosFila,
                'orcamentos_pendentes' => $orcamentosPendentes,
                'produtos_estoque' => $produtosEstoque,
                'alertas_criticos' => $alertaCriticoCount,
            ],
            'materiais_alertas' => $materiaisCriticos->map(function($m) {
                return [
                    'id' => $m->id,
                    'material' => $m->tipo . ' (' . $m->marca . ')',
                    'restando' => $m->quantidade_restante . $m->unidade,
                    'status' => $m->quantidade_restante <= 200 ? 'Crítico' : 'Atenção'
                ];
            }),
            'fila_producao' => [] // Futura tabela de Impressões
        ]);
    }
}
