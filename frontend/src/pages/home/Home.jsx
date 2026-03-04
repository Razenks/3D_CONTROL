import React from 'react';
import Layout from '../../components/layout/Layout';
import StatCard from './components/StatCard';
import MaterialAlerts from './components/MaterialAlerts';
import OrdersQueue from './components/OrdersQueue';

export default function Home() {
  return (
    <Layout>
      {/* Cabeçalho da Página */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">
            Visão Geral da Produção
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe seus pedidos, orçamentos e nível de insumos.
          </p>
        </div>
        
        {/* Botão de Ação Rápida no topo */}
        <button className="bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
          + Novo Pedido
        </button>
      </div>

      {/* Grid de Cards de Estatísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          titulo="Pedidos na Fila" 
          valor="14" 
          descricao="4 para iniciar hoje" 
        />
        <StatCard 
          titulo="Orçamentos Pendentes" 
          valor="7" 
          descricao="Aguardando precificação" 
        />
        <StatCard 
          titulo="Impressões Concluídas" 
          valor="32" 
          descricao="Nesta semana" 
        />
        <StatCard 
          titulo="Alertas Críticos" 
          valor="2" 
          descricao="Materiais acabando" 
          alerta={true} 
        />
      </div>

      {/* Grid Inferior: Fila de Produção e Alertas lado a lado em telas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fila de Produção ocupa 2/3 da tela em monitores grandes */}
        <div className="lg:col-span-2">
          <OrdersQueue />
        </div>

        {/* Alertas de Material ocupa 1/3 da tela */}
        <div className="lg:col-span-1">
          <MaterialAlerts />
        </div>

      </div>
    </Layout>
  );
}