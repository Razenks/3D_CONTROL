<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Produto;
use App\Models\Orcamento;
use App\Models\Impressao;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $orcamentosPendentes = Orcamento::whereIn('status', ['Aguardando Análise', 'Precificando'])->count();
        $produtosEstoque = Produto::whereRaw('ativo = true')->where('quantidade', '>', 0)->count();
        $pedidosFila = Impressao::whereIn('status', ['fila', 'imprimindo'])->count();

        // Materiais com estoque abaixo do mínimo configurado
        $materiaisCriticos = Material::with(['marca', 'cor'])
            ->whereRaw('ativo = true')
            ->whereColumn('quantidade_restante', '<=', 'estoque_minimo')
            ->orderBy('quantidade_restante', 'asc')
            ->get();

        // Crítico = abaixo de metade do mínimo
        $alertaCriticoCount = $materiaisCriticos->filter(function ($m) {
            return $m->quantidade_restante <= ($m->estoque_minimo / 2);
        })->count();

        return response()->json([
            'stats' => [
                'pedidos_fila' => $pedidosFila,
                'orcamentos_pendentes' => $orcamentosPendentes,
                'produtos_estoque' => $produtosEstoque,
                'alertas_criticos' => $alertaCriticoCount,
            ],
            'materiais_alertas' => $materiaisCriticos->map(function ($m) {
                $critico = $m->quantidade_restante <= ($m->estoque_minimo / 2);
                return [
                    'id' => $m->id,
                    'material' => $m->tipo . ' (' . ($m->marca->nome ?? 'Sem marca') . ')',
                    'cor' => $m->cor->nome ?? 'Sem cor',
                    'hex' => $m->cor->hex ?? '#999999',
                    'restando' => $m->quantidade_restante . $m->unidade,
                    'minimo' => $m->estoque_minimo . $m->unidade,
                    'status' => $critico ? 'Crítico' : 'Baixo'
                ];
            }),
            'fila_producao' => Impressao::with('impressora')
                ->whereIn('status', ['fila', 'imprimindo'])
                ->orderBy('created_at', 'asc')
                ->limit(10)
                ->get()
                ->map(function ($imp) {
                    return [
                        'id' => $imp->id,
                        'projeto' => $imp->projeto_nome,
                        'impressora' => $imp->impressora->nome ?? 'N/A',
                        'status' => $imp->status,
                        'progresso' => $imp->progresso
                    ];
                })
        ]);
    }
}
