import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaImpressoras from './components/TabelaImpressoras';
import ModalNovaImpressora from './components/ModalNovaImpressora';

export default function Configuracoes() {
  const [impressoras, setImpressoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImpressoras = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch('http://localhost:8000/api/impressoras', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setImpressoras(data);
      }
    } catch (err) {
      console.error('Erro ao buscar impressoras:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStatus = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`http://localhost:8000/api/impressoras/${id}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      alert(data.message);
      fetchImpressoras(); // Atualiza a lista para mostrar o novo status
    } catch (err) {
      alert('Erro ao verificar status da impressora.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta máquina?')) return;

    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`http://localhost:8000/api/impressoras/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        fetchImpressoras();
      }
    } catch (err) {
      alert('Erro ao excluir impressora.');
    }
  };

  useEffect(() => {
    fetchImpressoras();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#2A3240]">Configurações do Sistema</h2>
        <p className="text-sm text-gray-600 mt-1">Gerencie suas máquinas, integrações e preferências.</p>
      </div>

      <div className="space-y-8">
        {/* Seção de Impressoras */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#2A3240] uppercase tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Minhas Impressoras
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2A3240] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>+ Adicionar Máquina</span>
            </button>
          </div>

          <TabelaImpressoras 
            impressoras={impressoras} 
            loading={loading} 
            onDelete={handleDelete}
            onVerify={handleVerifyStatus}
          />
        </section>

        {/* Seção de Perfil / Sistema (Placeholders) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2">Preferências de Cálculo</h4>
                <p className="text-sm text-gray-500 mb-4">Defina valores padrão para a calculadora de precificação.</p>
                <button className="text-sm font-bold text-[#FF9B54] opacity-50 cursor-not-allowed">Configurar (Em breve)</button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2">Conta e Segurança</h4>
                <p className="text-sm text-gray-500 mb-4">Gerencie sua senha e informações de acesso.</p>
                <button className="text-sm font-bold text-[#FF9B54] opacity-50 cursor-not-allowed">Alterar Senha (Em breve)</button>
            </div>
        </section>
      </div>

      <ModalNovaImpressora 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSucesso={fetchImpressoras}
      />
    </Layout>
  );
}
