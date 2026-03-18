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
    <section className="bg-white dark:bg-[#2A3240] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-[#2A3240] dark:text-white uppercase tracking-tight flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        Gerenciar Cores
      </h3>
      
      {loading ? (
        <p className="text-sm text-gray-500">Carregando cores...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cores.map(cor => (
            <button
              key={cor.id}
              onClick={() => setEditingCor(cor)}
              className="group relative flex flex-col items-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#FF9B54] transition-all bg-gray-50 dark:bg-gray-800/50"
            >
              <div 
                className="w-10 h-10 rounded-full border border-gray-200 shadow-sm mb-2 group-hover:scale-110 transition-transform" 
                style={{ backgroundColor: cor.hex || '#ccc' }}
              />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">#{cor.codigo}</span>
              <span className="text-xs font-bold text-[#2A3240] dark:text-gray-200 truncate w-full text-center">{cor.nome}</span>
              
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                <span className="bg-white dark:bg-gray-700 text-[10px] font-black px-2 py-1 rounded shadow-sm">EDITAR</span>
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
