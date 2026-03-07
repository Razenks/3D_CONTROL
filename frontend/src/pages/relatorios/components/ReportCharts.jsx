import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#FF9B54', '#2A3240', '#4CAF50', '#2196F3', '#9C27B0', '#FFC107'];

export default function ReportCharts({ data, tipo }) {
  
  if (tipo === 'geral') {
    // Gráfico de Barras para Faturamento por Produto
    const barData = data.topProdutos.map(p => ({
      name: p.nome.substring(0, 15) + (p.nome.length > 15 ? '...' : ''),
      faturamento: parseFloat(p.faturamento.replace('R$ ', '').replace('.', '').replace(',', '.'))
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-6 tracking-wider text-center">Faturamento por Produto (R$)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="faturamento" fill="#FF9B54" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-6 tracking-wider text-center">Distribuição de Vendas (Qtd)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.topProdutos}
                  dataKey="qtd"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.topProdutos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (tipo === 'material') {
    const pieData = data.detalhes.map(d => ({
      name: d.material || 'Não informado',
      value: parseFloat(d.total_peso)
    }));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <h4 className="text-sm font-bold text-gray-500 uppercase mb-6 tracking-wider text-center">Uso de Filamento por Tipo (Gramas)</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}g`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}g`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (tipo === 'orcamentos') {
    const barData = data.detalhes.map(d => ({
      name: d.status,
      quantidade: d.total
    }));

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
        <h4 className="text-sm font-bold text-gray-500 uppercase mb-6 tracking-wider text-center">Status de Orçamentos (Quantidade)</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={12} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="quantidade" fill="#2A3240" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}
