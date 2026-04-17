import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import API_BASE_URL from '../../config';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const TABS = [
  { id: 'geral', label: 'Financeiro' },
  { id: 'filamento', label: 'Filamento' },
  { id: 'compras', label: 'Compras' },
  { id: 'clientes_inativos', label: 'Clientes Inativos' },
];

const CORES_GRAFICO = ['#FF9B54', '#2A3240', '#4CAF50', '#E91E63', '#2196F3', '#FF5722', '#9C27B0', '#00BCD4'];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('30');
  const [produto, setProduto] = useState('all');
  const [listaProdutos, setListaProdutos] = useState([]);
  const [tab, setTab] = useState('geral');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/relatorios?tipo=produtos_lista`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (response.ok) setListaProdutos(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchRelatorios = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/relatorios?periodo=${periodo}&tipo=${tab}&produto=${produto}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (response.ok) setDados(await response.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProdutos(); }, []);
  useEffect(() => { fetchRelatorios(); }, [periodo, tab, produto]);

  const fmt = (v) => parseFloat(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtG = (v) => {
    const g = parseFloat(v || 0);
    if (g >= 1000) return (g / 1000).toFixed(2) + ' kg';
    return g.toFixed(0) + ' g';
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">Relatórios e Métricas</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Análise de desempenho da RB PRINTINGS.</p>
        </div>
        <div className="flex gap-2">
          {tab === 'geral' && (
            <select
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              className="px-4 py-2 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#FF9B54] transition-all"
            >
              <option value="all">Todos os Produtos</option>
              {listaProdutos.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          )}
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl font-bold text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#FF9B54] transition-all"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="all">Todo o período</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl w-fit transition-colors">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              tab === t.id ? 'bg-[#2A3240] dark:bg-orange-500 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600 font-bold uppercase animate-pulse">Gerando Relatório...</div>
      ) : (
        <>
          {tab === 'geral' && <TabFinanceiro dados={dados} fmt={fmt} fmtG={fmtG} />}
          {tab === 'filamento' && <TabFilamento dados={dados} fmt={fmt} fmtG={fmtG} />}
          {tab === 'compras' && <TabCompras dados={dados} fmt={fmt} fmtG={fmtG} />}
          {tab === 'clientes_inativos' && <TabClientesInativos dados={dados} fmt={fmt} />}
        </>
      )}
    </Layout>
  );
}

/* ==================== ABA CLIENTES INATIVOS ==================== */
function TabClientesInativos({ dados, fmt }) {
  if (!dados) return null;
  const clientes = dados.clientes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Clientes Inativos (+{dados.limite_dias} dias sem compra)
        </h4>
        {clientes.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Nenhum cliente inativo encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b dark:border-gray-800">
                  <th className="text-left py-3">Cliente</th>
                  <th className="text-left py-3">Última Compra</th>
                  <th className="text-center py-3">Dias Inativo</th>
                  <th className="text-right py-3">Total Histórico</th>
                  <th className="text-right py-3">Qtd Compras</th>
                  <th className="text-right py-3">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {clientes.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 font-bold text-[#2A3240] dark:text-gray-200">{c.nome}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">{c.ultima_compra}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        c.dias_inativo > 120 ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}>
                        {c.dias_inativo === 999 ? 'NUNCA COMPROU' : `${c.dias_inativo} dias`}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium dark:text-gray-200">R$ {fmt(c.valor_total_historico)}</td>
                    <td className="py-3 text-right text-gray-400 dark:text-gray-500">{c.qtd_compras}</td>
                    <td className="py-3 text-right">
                      <a 
                        href={`https://wa.me/55${c.telefone?.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-green-600 dark:text-green-400 font-bold hover:underline"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== ABA COMPRAS ==================== */
function TabCompras({ dados, fmt, fmtG }) {
  if (!dados) return null;

  const resumo = dados.resumo || {};
  const porMaterial = dados.por_material || [];
  const porFornecedor = dados.por_fornecedor || [];
  const ultimasCompras = dados.ultimas_compras || [];

  // Pizza: compras por material
  const pizzaMaterial = porMaterial.map(item => ({
    name: item.tipo,
    value: parseFloat(item.total)
  }));

  // Barra: compras por fornecedor
  const barFornecedor = porFornecedor.map(item => ({
    name: item.fornecedor,
    total: parseFloat(item.total)
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardMetrica label="Total Investido" valor={`R$ ${fmt(resumo.total_gasto)}`} cor="text-[#FF9B54]" destaque />
        <CardMetrica label="Quantidade Comprada" valor={fmtG(resumo.total_quantidade * 1000)} cor="text-blue-500 dark:text-blue-400" />
        <CardMetrica label="Número de Compras" valor={resumo.total_compras || 0} cor="text-green-600 dark:text-green-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico Pizza: Investimento por Material */}
        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Investimento por Tipo de Material</h4>
          {pizzaMaterial.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Sem dados no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pizzaMaterial}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {pizzaMaterial.map((_, i) => (
                    <Cell key={i} fill={CORES_GRAFICO[i % CORES_GRAFICO.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip fmt={fmt} sufixo="R$ " />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gráfico Barra: Investimento por Fornecedor */}
        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Investimento por Fornecedor</h4>
          {barFornecedor.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Sem dados no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barFornecedor} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(v) => `R$${v}`}
                />
                <Tooltip content={<CustomTooltip fmt={fmt} sufixo="R$ " />} />
                <Bar dataKey="total" fill="#FF9B54" radius={[8, 8, 0, 0]} name="Total Gasto" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tabela de Últimas Compras */}
      <div className="bg-[#2A3240] dark:bg-gray-800/50 p-6 rounded-2xl shadow-xl text-white transition-colors border dark:border-gray-700/50">
        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Histórico de Últimas Compras</h4>
        {ultimasCompras.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-600">Nenhuma compra registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-700 dark:border-gray-700/50">
                  <th className="text-left py-3">Data</th>
                  <th className="text-left py-3">Material</th>
                  <th className="text-left py-3">Fornecedor</th>
                  <th className="text-right py-3">Qtd (kg)</th>
                  <th className="text-right py-3">Preço/kg</th>
                  <th className="text-right py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {ultimasCompras.map((c, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gray-400 dark:text-gray-500">{c.data}</td>
                    <td className="py-3">
                      <span className="font-bold">{c.material}</span>
                      <span className="block text-[10px] text-gray-500 dark:text-gray-600 uppercase font-black">{c.marca}</span>
                    </td>
                    <td className="py-3 text-gray-300 dark:text-gray-400">{c.fornecedor || 'Não inf.'}</td>
                    <td className="py-3 text-right font-medium">{c.quantidade.toFixed(2)} kg</td>
                    <td className="py-3 text-right text-gray-400 dark:text-gray-500">R$ {fmt(c.custo_unidade)}</td>
                    <td className="py-3 text-right font-black text-[#FF9B54]">R$ {fmt(c.valor_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== TOOLTIP CUSTOMIZADO ==================== */
function CustomTooltip({ active, payload, fmt, sufixo = '' }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border dark:border-gray-700 text-sm">
      <p className="font-bold text-[#2A3240] dark:text-gray-200">{d.name}</p>
      <p className="font-black text-[#FF9B54]">{sufixo}{typeof fmt === 'function' ? fmt(d.value) : d.value}</p>
    </div>
  );
}

/* ==================== LABEL CUSTOMIZADO PIZZA ==================== */
function renderPieLabel({ name, percent }) {
  if (percent < 0.05) return null;
  return `${name} (${(percent * 100).toFixed(0)}%)`;
}

/* ==================== ABA FINANCEIRO ==================== */
function TabFinanceiro({ dados, fmt, fmtG }) {
  if (!dados) return null;

  const fin = dados.financeiro || {};
  const porPagamento = dados.por_pagamento || [];
  const topVendidos = dados.top_vendidos || [];
  const prod = dados.producao || {};

  // Dados para pizza: Métodos de pagamento
  const pizzaPagamento = porPagamento.map(p => ({
    name: p.metodo_pagamento,
    value: parseFloat(p.total)
  }));

  // Dados para barra: Top produtos
  const barTopVendidos = topVendidos.map(p => ({
    name: p.nome?.length > 18 ? p.nome.substring(0, 18) + '...' : p.nome,
    faturamento: parseFloat(p.faturamento),
    vendas: parseInt(p.vendas)
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Resumo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardMetrica label="Receita Total" valor={`R$ ${fmt(fin.receita)}`} cor="text-green-600 dark:text-green-400" />
        <CardMetrica label="Custo Total" valor={`R$ ${fmt(fin.custo)}`} cor="text-red-500 dark:text-red-400" />
        <CardMetrica label="Lucro Total" valor={`R$ ${fmt(fin.lucro)}`} cor="text-[#FF9B54]" destaque />
      </div>

      {/* Gráficos: Pizza Pagamento + Resumo Vendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Receita por Pagamento</h4>
          {pizzaPagamento.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Sem dados no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pizzaPagamento}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {pizzaPagamento.map((_, i) => (
                    <Cell key={i} fill={CORES_GRAFICO[i % CORES_GRAFICO.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip fmt={fmt} sufixo="R$ " />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center transition-colors">
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF9B54] rounded-full"></span>
                Vendas Gerais
            </h4>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Volume de Vendas</span>
                    <span className="text-4xl font-black text-[#2A3240] dark:text-white leading-none">{fin.qtd_vendas || 0}</span>
                </div>
                <div className="space-y-3 pt-6 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</span>
                        <span className="font-bold text-[#2A3240] dark:text-gray-200">R$ {fin.qtd_vendas > 0 ? fmt(fin.receita / fin.qtd_vendas) : '0,00'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Margem Média</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{fin.receita > 0 ? ((fin.lucro / fin.receita) * 100).toFixed(1) : 0}%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Gráfico de Barras: Top Produtos Vendidos */}
      <div className="bg-[#2A3240] dark:bg-gray-800/50 p-6 rounded-2xl shadow-xl text-white border dark:border-gray-700/50">
        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Top Produtos Vendidos (Estoque)</h4>
        {topVendidos.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-600">Nenhuma venda de estoque no período.</p>
        ) : (
          <div className="space-y-3">
            {topVendidos.map((p, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-white/10 dark:bg-black/20 rounded-lg flex items-center justify-center text-[10px] font-black text-[#FF9B54] group-hover:scale-110 transition-transform">{i + 1}</span>
                  <span className="text-sm font-bold">{p.nome}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#FF9B54]">R$ {fmt(p.faturamento)}</span>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-600 font-bold">{p.vendas}x vendas</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produção */}
      <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Produção</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Total Impresso</span>
            <p className="text-xl font-black text-[#2A3240] dark:text-white">{prod.total_pecas || 0} un</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Lotes</span>
            <p className="text-xl font-black text-[#2A3240] dark:text-white">{prod.total_lotes || 0}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border-b-2 border-green-500/20">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Sucesso</span>
            <p className="text-xl font-black text-green-600 dark:text-green-400">{prod.sucesso || 0}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border-b-2 border-red-500/20">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Falhas</span>
            <p className="text-xl font-black text-red-500 dark:text-red-400">{prod.falhas || 0}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border-b-2 border-[#FF9B54]/20">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">Material Usado</span>
            <p className="text-xl font-black text-[#FF9B54]">{fmtG(prod.material_usado)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== ABA FILAMENTO ==================== */
function TabFilamento({ dados, fmt, fmtG }) {
  if (!dados) return null;

  const porTipo = dados.consumo_por_tipo || [];
  const porCor = dados.consumo_por_cor || [];
  const porMarca = dados.consumo_por_marca || [];
  const estoque = dados.estoque_atual || [];

  // Pizza: consumo por tipo
  const pizzaTipo = porTipo.map(item => ({
    name: item.tipo,
    value: parseFloat(item.total_g)
  }));

  // Pizza: consumo por cor (usando hex real)
  const pizzaCor = porCor.map(item => ({
    name: item.cor,
    value: parseFloat(item.total_g),
    hex: item.hex
  }));

  // Barra: consumo por marca
  const barMarca = porMarca.map(item => ({
    name: item.marca?.length > 15 ? item.marca.substring(0, 15) + '...' : item.marca,
    consumo: parseFloat(item.total_g)
  }));

  // Barra: estoque atual por material
  const barEstoque = estoque.map(m => ({
    name: `${m.tipo} ${m.cor}`.length > 18 ? `${m.tipo} ${m.cor}`.substring(0, 18) + '...' : `${m.tipo} ${m.cor}`,
    restante: m.restante_g,
    hex: m.hex
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardMetrica label="Filamento Consumido" valor={fmtG(dados.consumo_total_g)} cor="text-[#FF9B54]" destaque />
        <CardMetrica label="Custo do Filamento Usado" valor={`R$ ${fmt(dados.custo_consumo)}`} cor="text-red-500 dark:text-red-400" />
        <CardMetrica
          label="Estoque Atual Total"
          valor={fmtG(estoque.reduce((s, m) => s + m.restante_g, 0))}
          cor="text-green-600 dark:text-green-400"
        />
      </div>

      {/* Gráficos Pizza: Tipo + Cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Consumo por Tipo</h4>
          {pizzaTipo.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Sem dados no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pizzaTipo}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {pizzaTipo.map((_, i) => (
                    <Cell key={i} fill={CORES_GRAFICO[i % CORES_GRAFICO.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip fmt={(v) => fmtG(v)} />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Consumo por Cor</h4>
          {pizzaCor.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Sem dados no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pizzaCor}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {pizzaCor.map((entry, i) => (
                    <Cell key={i} fill={entry.hex || CORES_GRAFICO[i % CORES_GRAFICO.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip fmt={(v) => fmtG(v)} />} />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico Barra: Consumo por Marca */}
      {barMarca.length > 0 && (
        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Consumo por Marca</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barMarca} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}kg` : `${v}g`}
              />
              <Tooltip content={<CustomTooltip fmt={(v) => fmtG(v)} />} />
              <Bar dataKey="consumo" fill="#2A3240" dark:fill-orange-500 radius={[8, 8, 0, 0]} name="Consumo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico Barra: Estoque Atual */}
      {barEstoque.length > 0 && (
        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Estoque Atual por Material</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barEstoque} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}kg` : `${v}g`}
              />
              <Tooltip content={<CustomTooltip fmt={(v) => fmtG(v)} />} />
              <Bar dataKey="restante" name="Restante" radius={[8, 8, 0, 0]}>
                {barEstoque.map((entry, i) => (
                  <Cell key={i} fill={entry.hex || CORES_GRAFICO[i % CORES_GRAFICO.length]} stroke="#374151" strokeWidth={1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabela estoque detalhado */}
      <div className="bg-[#2A3240] dark:bg-gray-800/50 p-6 rounded-2xl shadow-xl text-white transition-colors border dark:border-gray-700/50">
        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Estoque Detalhado de Filamento</h4>
        {estoque.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-600">Nenhum material cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-700 dark:border-gray-700/50">
                  <th className="text-left py-3">Material</th>
                  <th className="text-left py-3">Marca</th>
                  <th className="text-left py-3">Cor</th>
                  <th className="text-right py-3">Restante</th>
                  <th className="text-right py-3">Custo/kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {estoque.map((m, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold">{m.tipo}</td>
                    <td className="py-3 text-gray-400 dark:text-gray-500">{m.marca}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-gray-600 dark:border-gray-700 shadow-sm" style={{ backgroundColor: m.hex }}></div>
                        <span className="text-gray-300 dark:text-gray-400">{m.cor}</span>
                      </div>
                    </td>
                    <td className={`py-3 text-right font-black ${m.restante_g < 200 ? 'text-red-400' : 'text-green-400'}`}>
                      {fmtG(m.restante_g)}
                    </td>
                    <td className="py-3 text-right text-gray-400 dark:text-gray-500 font-bold text-xs">R$ {parseFloat(m.custo_kg).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== COMPONENTE CARD ==================== */
function CardMetrica({ label, valor, cor, destaque }) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border transition-colors ${destaque ? 'bg-gray-50 dark:bg-orange-500/10 border-gray-200 dark:border-orange-500/20' : 'bg-white dark:bg-[#1a1f2e] border-gray-100 dark:border-gray-800'}`}>
      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
      <p className={`text-2xl font-black ${cor} mt-1`}>{valor}</p>
    </div>
  );
}
