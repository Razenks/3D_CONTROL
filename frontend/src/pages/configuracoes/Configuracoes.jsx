import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaImpressoras from './components/TabelaImpressoras';
import ModalNovaImpressora from './components/ModalNovaImpressora';
import SeccaoCores from './components/SeccaoCores';
import API_BASE_URL from '../../config';

export default function Configuracoes() {
  const [impressoras, setImpressoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImpressoras = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/impressoras`, {
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
      const response = await fetch(`${API_BASE_URL}/api/impressoras/${id}/status`, {
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
      const response = await fetch(`${API_BASE_URL}/api/impressoras/${id}`, {
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

  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    fetchImpressoras();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#2A3240] dark:text-white transition-colors">Configurações do Sistema</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie suas máquinas, integrações e preferências.</p>
      </div>

      <div className="space-y-8">
        {/* Seção de Preferências de Aparência */}
        <section className="bg-white dark:bg-[#2A3240] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h3 className="text-lg font-bold text-[#2A3240] dark:text-white uppercase tracking-tight flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Aparência do Sistema
            </h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-gray-700 dark:text-gray-200">Modo Escuro (Dark Mode)</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Alternar entre o tema claro e o tema escuro.</p>
                </div>
                <button 
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${darkMode ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        </section>

        {/* Seção de Impressoras */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#2A3240] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Minhas Impressoras
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-700 dark:hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm"
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

        {/* Gerenciar Cores */}
        <SeccaoCores />

        {/* Seção de Perfil / Sistema (Placeholders) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Preferências de Cálculo</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Defina valores padrão para a calculadora de precificação.</p>
                <button className="text-sm font-bold text-[#FF9B54] opacity-50 cursor-not-allowed">Configurar (Em breve)</button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Conta e Segurança</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gerencie sua senha e informações de acesso.</p>
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
