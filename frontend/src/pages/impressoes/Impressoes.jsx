import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import TabelaImpressoes from './components/TabelaImpressoes';
import ModalNovaImpressao from './components/ModalNovaImpressao';

export default function Impressoes() {
  const navigate = useNavigate();
  const [fila, setFila] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalNovaOpen, setIsModalNovaOpen] = useState(false);

  const fetchImpressoes = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch('http://localhost:8000/api/impressoes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFila(data.filter(i => i.status === 'fila' || i.status === 'imprimindo' || i.status === 'pausado'));
        setHistorico(data.filter(i => i.status === 'concluido' || i.status === 'falha'));
      } else {
        setError('Erro ao carregar impressões.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpressoes();
  }, []);

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">
            Gestão de Impressões
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Controle a fila de produção e o status das suas máquinas.
          </p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => navigate('/configuracoes')}
                className="bg-white border border-gray-300 text-gray-700 font-bold py-2.5 px-5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Gerenciar Máquinas
            </button>

            <button 
                className="bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                onClick={() => setIsModalNovaOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nova Impressão
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Sincronizando com as máquinas...</div>
      ) : (
        <>
          <TabelaImpressoes 
            titulo="Fila de Produção (Ativa)" 
            dados={fila} 
            isHistorico={false} 
            onRefresh={fetchImpressoes}
          />

          <TabelaImpressoes 
            titulo="Histórico de Impressões" 
            dados={historico} 
            isHistorico={true} 
            onRefresh={fetchImpressoes}
          />
        </>
      )}

      <ModalNovaImpressao 
        isOpen={isModalNovaOpen} 
        onClose={() => setIsModalNovaOpen(false)} 
        onSucesso={fetchImpressoes}
      />
    </Layout>
  );
}
