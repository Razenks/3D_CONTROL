import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from './components/StatCard';
import MaterialAlerts from './components/MaterialAlerts';
import OrdersQueue from './components/OrdersQueue';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch('http://localhost:8000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error('Erro ao buscar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Layout><div className="text-center py-20 text-gray-500">Carregando visão geral...</div></Layout>;

  return (
    <Layout>
      {/* Cabeçalho da Página */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#2A3240] uppercase tracking-tighter">
            Visão Geral da Produção
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Acompanhe seus pedidos, orçamentos e nível de insumos.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/calculadora')}
          className="bg-[#FF9B54] hover:bg-orange-500 text-white font-black py-3 px-6 rounded-xl shadow-lg transition-all uppercase text-xs tracking-widest whitespace-nowrap"
        >
          + Novo Pedido
        </button>
      </div>

      {/* Grid de Cards de Estatísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          titulo="Pedidos na Fila" 
          valor={data?.stats.pedidos_fila || "0"} 
          descricao="Aguardando início" 
        />
        <StatCard 
          titulo="Orçamentos Pendentes" 
          valor={data?.stats.orcamentos_pendentes || "0"} 
          descricao="Aguardando precificação" 
        />
        <StatCard 
          titulo="Produtos no Estoque" 
          valor={data?.stats.produtos_estoque || "0"} 
          descricao="Pronta entrega" 
        />
        <StatCard 
          titulo="Alertas Críticos" 
          valor={data?.stats.alertas_criticos || "0"} 
          descricao="Materiais acabando" 
          alerta={data?.stats.alertas_criticos > 0} 
        />
      </div>

      {/* Grid Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <OrdersQueue pedidos={data?.fila_producao || []} />
        </div>

        <div className="lg:col-span-1">
          <MaterialAlerts alertas={data?.materiais_alertas || []} />
        </div>

      </div>
    </Layout>
  );
}
