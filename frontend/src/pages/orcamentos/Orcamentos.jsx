import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaOrcamentos from './components/TabelaOrcamentos';
import API_BASE_URL from '../../config';

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrcamentos = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/orcamentos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrcamentos(data);
      }
    } catch (err) {
      console.error('Erro ao buscar orçamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  // Filtros simples
  const ativos = orcamentos.filter(o => o.status !== 'Rejeitado' && o.status !== 'Aprovado' && o.status !== 'Finalizado');
  const aprovados = orcamentos.filter(o => o.status === 'Aprovado');
  const historico = orcamentos.filter(o => o.status === 'Rejeitado' || o.status === 'Finalizado');

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#2A3240]">
          Gestão de Orçamentos
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Analise solicitações, aprove orçamentos e envie para produção.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">
          Carregando orçamentos...
        </div>
      ) : (
        <div className="space-y-4">
          <TabelaOrcamentos 
            titulo="Aguardando Análise / Em Aberto" 
            dados={ativos} 
            onRefresh={fetchOrcamentos}
          />
          
          <TabelaOrcamentos 
            titulo="Aprovados (Pronto para Impressão)" 
            dados={aprovados} 
            onRefresh={fetchOrcamentos}
          />

          <TabelaOrcamentos 
            titulo="Histórico (Rejeitados / Finalizados)" 
            dados={historico} 
            isHistorico={true} 
            onRefresh={fetchOrcamentos}
          />
        </div>
      )}
    </Layout>
  );
}
