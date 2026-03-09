import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import API_BASE_URL from '../../config';

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('30');
  const [tipo, setTipo] = useState('geral');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRelatorios = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/relatorios?periodo=${periodo}&tipo=${tipo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        setDados(result);
      }
    } catch (err) {
      console.error('Erro ao buscar relatórios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, [periodo, tipo]);

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">Relatórios e Métricas</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Análise de desempenho da RB PRINTINGS.</p>
        </div>

        <div className="flex gap-2">
          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 border rounded-xl font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#FF9B54]"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="all">Todo o período</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold uppercase animate-pulse">Gerando Relatório...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumo Financeiro */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-[#2A3240] uppercase tracking-widest mb-6 border-b pb-4">Desempenho Financeiro</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase">Receita Bruta</span>
                <p className="text-2xl font-black text-green-600">R$ {parseFloat(dados?.financeiro?.receita || 0).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase">Custo de Materiais</span>
                <p className="text-2xl font-black text-red-500">R$ {parseFloat(dados?.financeiro?.custo || 0).toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="text-[10px] font-black text-[#2A3240] uppercase">Lucro Estimado</span>
                <p className="text-2xl font-black text-[#FF9B54]">R$ {parseFloat(dados?.financeiro?.lucro || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Volume de Produção */}
          <div className="bg-[#2A3240] p-8 rounded-2xl shadow-xl text-white">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-gray-700 pb-4">Produção</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Total Impresso</span>
                <span className="text-xl font-black">{dados?.producao?.total_pecas || 0} un</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Sucesso</span>
                <span className="text-xl font-black text-green-400">{dados?.producao?.sucesso || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Falhas</span>
                <span className="text-xl font-black text-red-400">{dados?.producao?.falhas || 0}</span>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <span className="text-[10px] font-black text-gray-500 uppercase">Material Consumido</span>
                <p className="text-xl font-black text-[#FF9B54]">{dados?.producao?.material_usado || 0}g</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
