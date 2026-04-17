import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';
import ModalEditarCor from './ModalEditarCor';

export default function SeccaoCores() {
  const [cores, setCores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCor, setEditingCor] = useState(null);

  const fetchCores = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/cores`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setCores(await response.json());
      }
    } catch (err) {
      console.error('Erro ao buscar cores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCores();
  }, []);

  return (
    <section className="bg-white dark:bg-[#1a1f2e] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter flex items-center gap-3 mb-8 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-[#FF9B54] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        </div>
        Gerenciar Cores
      </h3>
      
      {loading ? (
        <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
                <div className="h-2 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {cores.map(cor => (
            <button
              key={cor.id}
              onClick={() => setEditingCor(cor)}
              className="group relative flex flex-col items-center p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#FF9B54] dark:hover:border-[#FF9B54] transition-all bg-gray-50 dark:bg-gray-800/20 hover:shadow-lg hover:shadow-orange-500/5"
            >
              <div 
                className="w-12 h-12 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" 
                style={{ backgroundColor: cor.hex || '#ccc' }}
              />
              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">#{cor.codigo}</span>
              <span className="text-xs font-black text-[#2A3240] dark:text-gray-200 truncate w-full text-center uppercase tracking-tighter">{cor.nome}</span>
              
              <div className="absolute inset-0 bg-[#FF9B54]/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-all flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-[#FF9B54] text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg tracking-widest transform scale-90 group-hover:scale-100 transition-transform">EDITAR</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <ModalEditarCor 
        isOpen={!!editingCor} 
        cor={editingCor} 
        onClose={() => setEditingCor(null)} 
        onSucesso={fetchCores} 
      />
    </section>
  );
}
