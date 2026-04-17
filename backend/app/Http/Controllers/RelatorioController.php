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
        $tipo = $request->query('tipo', 'geral');
        $produto = $request->query('produto', 'all');

        if ($periodo === 'all') {
            $startDate = Carbon::create(2000, 1, 1);
        } else {
            $startDate = Carbon::now()->subDays((int)$periodo);
        }

        if ($tipo === 'geral') {
            return response()->json($this->relatorioGeral($startDate, $produto));
        } else if ($tipo === 'filamento') {
            return response()->json($this->relatorioFilamento($startDate));
        } else if ($tipo === 'compras') {
            return response()->json($this->relatorioCompras($startDate));
        } else if ($tipo === 'clientes_inativos') {
            return response()->json($this->relatorioClientesInativos());
        } else if ($tipo === 'produtos_lista') {
            return response()->json($this->listaProdutos());
        }

        return response()->json(['tipo' => $tipo, 'periodo' => $periodo]);
    }

    private function listaProdutos()
    {
        // Pega todos os nomes únicos de projetos (vendas)
        $projetos = Orcamento::whereIn('status', ['Aprovado', 'Finalizado', 'Pago'])
            ->select('projeto')
            ->distinct()
            ->get()
            ->map(function ($item) {
                return preg_replace('/^VENDA\s*\(\d+x\):\s*/', '', $item->projeto);
            })
            ->unique()
            ->values();

        return $projetos;
    }

    private function relatorioClientesInativos()
    {
        // Clientes que não compram há mais de 60 dias (Aprovado, Finalizado ou Pago)
        $limiteDias = 60;
        $dataLimite = Carbon::now()->subDays($limiteDias);

        $clientes = \App\Models\Cliente::where('ativo', true)
            ->with(['orcamentos' => function($query) {
                $query->whereIn('status', ['Aprovado', 'Finalizado', 'Pago'])
                      ->orderBy('created_at', 'desc');
            }])
            ->get()
            ->map(function($cliente) use ($dataLimite) {
                $ultimoOrcamento = $cliente->orcamentos->first();
                $dataUltimaCompra = $ultimoOrcamento ? $ultimoOrcamento->created_at : null;
                $diasInativo = $dataUltimaCompra ? Carbon::now()->diffInDays($dataUltimaCompra) : 999;

                return [
                    'id' => $cliente->id,
                    'nome' => $cliente->nome,
                    'telefone' => $cliente->telefone,
                    'ultima_compra' => $dataUltimaCompra ? $dataUltimaCompra->format('d/m/Y') : 'Nunca',
                    'dias_inativo' => $diasInativo,
                    'valor_total_historico' => (float) $cliente->orcamentos->sum('valor_total'),
                    'qtd_compras' => $cliente->orcamentos->count(),
                ];
            })
            ->filter(function($cliente) use ($limiteDias) {
                return $cliente['dias_inativo'] >= $limiteDias;
            })
            ->sortByDesc('dias_inativo')
            ->values();

        return [
            'tipo' => 'clientes_inativos',
            'clientes' => $clientes,
            'limite_dias' => $limiteDias
        ];
    }

    private function relatorioGeral($startDate, $produto = 'all')
    {
        $queryOrcamentos = Orcamento::where('created_at', '>=', $startDate)
            ->whereIn('status', ['Aprovado', 'Finalizado', 'Pago']);

        if ($produto !== 'all') {
            $queryOrcamentos->where('projeto', 'LIKE', "%$produto%");
        }

        // Financeiro total
        $statsOrcamentos = (clone $queryOrcamentos)
            ->select(
                DB::raw('SUM(valor_total) as faturamento'),
                DB::raw('SUM(lucro_estimado) as lucro'),
                DB::raw('SUM(custo_estimado) as custo'),
                DB::raw('COUNT(*) as qtd')
            )->first();

        // Receita por método de pagamento
        $porPagamento = (clone $queryOrcamentos)
            ->whereIn('status', ['Finalizado', 'Pago'])
            ->whereNotNull('metodo_pagamento')
            ->select('metodo_pagamento', DB::raw('SUM(valor_total) as total'), DB::raw('COUNT(*) as qtd'))
            ->groupBy('metodo_pagamento')
            ->orderBy('total', 'desc')
            ->get();

        // Top produtos vendidos (não filtrado por produto individualmente para manter o ranking, 
        // a menos que o usuário queira ver a performance daquele produto específico no tempo)
        // Se houver filtro de produto, talvez o ranking de "Top" não faça sentido, mas vamos manter
        // a query filtrada se o usuário pediu um produto específico.
        
        $topVendidos = (clone $queryOrcamentos)
            ->whereIn('status', ['Finalizado', 'Pago'])
            ->select('projeto', DB::raw('COUNT(*) as vendas'), DB::raw('SUM(valor_total) as faturamento'))
            ->groupBy('projeto')
            ->orderBy('vendas', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                $nome = preg_replace('/^VENDA\s*\(\d+x\):\s*/', '', $item->projeto);
                $item->nome = $nome;
                return $item;
            });

        // Produção (Este filtro é mais difícil pois Impressao não tem link direto fácil com produto via nome string)
        // Mas se quisermos ser precisos, teríamos que ligar Impressao -> Orcamento -> Produto
        // Por enquanto, o filtro de produto afetará apenas o financeiro.
        
        $statsImpressoes = Impressao::where('created_at', '>=', $startDate)
            ->select(
                DB::raw('SUM(peso_estimado * quantidade) as consumo_gramas'),
                DB::raw('SUM(quantidade) as total_pecas'),
                DB::raw('COUNT(*) as total_lotes'),
                DB::raw("SUM(CASE WHEN status = 'concluido' THEN quantidade ELSE 0 END) as sucesso"),
                DB::raw("SUM(CASE WHEN status = 'falha' THEN quantidade ELSE 0 END) as falhas")
            )->first();

        return [
            'tipo' => 'geral',
            'financeiro' => [
                'receita' => (float) ($statsOrcamentos->faturamento ?? 0),
                'lucro' => (float) ($statsOrcamentos->lucro ?? 0),
                'custo' => (float) ($statsOrcamentos->custo ?? 0),
                'qtd_vendas' => (int) ($statsOrcamentos->qtd ?? 0),
            ],
            'por_pagamento' => $porPagamento,
            'top_vendidos' => $topVendidos,
            'producao' => [
                'total_pecas' => (int) ($statsImpressoes->total_pecas ?? 0),
                'total_lotes' => (int) ($statsImpressoes->total_lotes ?? 0),
                'sucesso' => (int) ($statsImpressoes->sucesso ?? 0),
                'falhas' => (int) ($statsImpressoes->falhas ?? 0),
                'material_usado' => (float) ($statsImpressoes->consumo_gramas ?? 0),
            ],
        ];
    }

    private function relatorioFilamento($startDate)
    {
        // Consumo total no período (baseado nas impressões concluídas)
        $consumoTotal = Impressao::where('impressoes.created_at', '>=', $startDate)
            ->where('impressoes.status', 'concluido')
            ->select(DB::raw('SUM(peso_estimado * quantidade) as total_g'))
            ->first();

        // Consumo por tipo de material (PLA, PETG, etc.)
        $consumoPorTipo = Impressao::where('impressoes.created_at', '>=', $startDate)
            ->where('impressoes.status', 'concluido')
            ->join('materials', 'impressoes.material_id', '=', 'materials.id')
            ->select('materials.tipo', DB::raw('SUM(impressoes.peso_estimado * impressoes.quantidade) as total_g'))
            ->groupBy('materials.tipo')
            ->orderBy('total_g', 'desc')
            ->get();

        // Consumo por cor
        $consumoPorCor = Impressao::where('impressoes.created_at', '>=', $startDate)
            ->where('impressoes.status', 'concluido')
            ->join('materials', 'impressoes.material_id', '=', 'materials.id')
            ->leftJoin('cores', 'materials.cor_id', '=', 'cores.id')
            ->select(
                DB::raw("COALESCE(cores.nome, 'Sem cor') as cor"),
                DB::raw("COALESCE(cores.hex, '#999999') as hex"),
                DB::raw('SUM(impressoes.peso_estimado * impressoes.quantidade) as total_g')
            )
            ->groupBy('cores.nome', 'cores.hex')
            ->orderBy('total_g', 'desc')
            ->get();

        // Consumo por marca
        $consumoPorMarca = Impressao::where('impressoes.created_at', '>=', $startDate)
            ->where('impressoes.status', 'concluido')
            ->join('materials', 'impressoes.material_id', '=', 'materials.id')
            ->leftJoin('marcas', 'materials.marca_id', '=', 'marcas.id')
            ->select(
                DB::raw("COALESCE(marcas.nome, 'Sem marca') as marca"),
                DB::raw('SUM(impressoes.peso_estimado * impressoes.quantidade) as total_g')
            )
            ->groupBy('marcas.nome')
            ->orderBy('total_g', 'desc')
            ->get();

        // Estoque atual de materiais
        $estoqueAtual = Material::with(['marca', 'cor'])
            ->whereRaw('ativo = true')
            ->orderBy('tipo')
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'tipo' => $m->tipo,
                    'marca' => $m->marca->nome ?? 'Sem marca',
                    'cor' => $m->cor->nome ?? 'Sem cor',
                    'hex' => $m->cor->hex ?? '#999999',
                    'restante_g' => (float) $m->quantidade_restante,
                    'custo_kg' => (float) $m->custo_unidade,
                    'unidade' => $m->unidade,
                ];
            });

        // Custo total de filamento consumido
        $custoConsumo = Impressao::where('impressoes.created_at', '>=', $startDate)
            ->where('impressoes.status', 'concluido')
            ->join('materials', 'impressoes.material_id', '=', 'materials.id')
            ->select(DB::raw('SUM((impressoes.peso_estimado * impressoes.quantidade / 1000) * materials.custo_unidade) as custo_total'))
            ->first();

        return [
            'tipo' => 'filamento',
            'consumo_total_g' => (float) ($consumoTotal->total_g ?? 0),
            'custo_consumo' => (float) ($custoConsumo->custo_total ?? 0),
            'consumo_por_tipo' => $consumoPorTipo,
            'consumo_por_cor' => $consumoPorCor,
            'consumo_por_marca' => $consumoPorMarca,
            'estoque_atual' => $estoqueAtual,
        ];
    }
}
