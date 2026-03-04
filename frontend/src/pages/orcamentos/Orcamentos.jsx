import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaOrcamentos from './components/TabelaOrcamentos';

export default function Orcamentos() {
  // Estados para armazenar os dados (futuramente virão da API PHP)
  const [pendentes, setPendentes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulação do Fetch para o Backend
  useEffect(() => {
    /* ====================================================================
    BLOCO FETCH COMENTADO - INTEGRAÇÃO FUTURA COM PHP
    ====================================================================
    const carregarOrcamentos = async () => {
      try {
        const response = await fetch('http://localhost/api/orcamentos.php');
        const data = await response.json();
        if (data.sucesso) {
          setPendentes(data.pendentes);
          setHistorico(data.historico);
        }
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarOrcamentos();
    ==================================================================== */

    // Mock de dados para visualização do Design
    setTimeout(() => {
      setPendentes([
        { id: 'ORC-2001', cliente: 'Carlos Andrade', projeto: 'Case Teclado Custom (SLA)', data: '20/02/2026', status: 'Aguardando Análise' },
        { id: 'ORC-2002', cliente: 'Tech Solutions LTDA', projeto: 'Lote 50x Suportes (PETG)', data: '19/02/2026', status: 'Precificando' },
      ]);
      
      setHistorico([
        { id: 'ORC-1988', cliente: 'Mariana Costa', projeto: 'Miniatura RPG (Resina)', data: '15/02/2026', valor: '85,00', status: 'Aprovado' },
        { id: 'ORC-1985', cliente: 'João Silva', projeto: 'Engrenagem Reposição', data: '10/02/2026', valor: '45,00', status: 'Rejeitado' },
        { id: 'ORC-1980', cliente: 'Empresa Alfa', projeto: 'Protótipo Caixa Eletrônica', data: '05/02/2026', valor: '320,00', status: 'Aprovado' },
      ]);
      
      setLoading(false);
    }, 800);
  }, []);

  return (
    <Layout>
      {/* Cabeçalho da Página com o Botão no Canto Superior Direito */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">
            Gestão de Orçamentos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Analise novas solicitações e consulte o histórico de cotações.
          </p>
        </div>
        
        <button 
          className="bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          onClick={() => console.log('Abrir modal/página de novo orçamento')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Orçamento
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Carregando dados...</div>
      ) : (
        <>
          {/* Tabela de Orçamentos Pendentes (Foco Principal) */}
          <TabelaOrcamentos 
            titulo="Orçamentos Pendentes (Fila de Análise)" 
            dados={pendentes} 
            isHistorico={false} 
          />

          {/* Tabela de Histórico (Consultas Passadas) */}
          <TabelaOrcamentos 
            titulo="Histórico de Orçamentos" 
            dados={historico} 
            isHistorico={true} 
          />
        </>
      )}
    </Layout>
  );
}