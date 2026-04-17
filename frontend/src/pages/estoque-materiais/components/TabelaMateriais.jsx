import React from 'react';
import API_BASE_URL from '../../../config';

export default function TabelaMateriais({ materiais, loading, onRefresh, onEdit, onCompra }) {

  const handleToggleAtivo = async (material) => {
    const token = localStorage.getItem('auth_token');
    try {
        await fetch(`${API_BASE_URL}/api/materiais/${material.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ativo: !material.ativo })
        });
        onRefresh();
    } catch (err) { console.error(err); }
  };

  const getEstoqueStatus = (mat) => {
    if (!mat.ativo) return null;
    const restante = parseFloat(mat.quantidade_restante);
    const minimo = parseFloat(mat.estoque_minimo || 200);
    if (restante <= minimo / 2) return 'critico';
    if (restante <= minimo) return 'baixo';
    return 'ok';
  };

  if (loading) return <div className="text-center py-10 text-gray-400 font-bold uppercase animate-pulse">Carregando...</div>;

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 border-b dark:border-gray-800">Material / Marca</th>
              <th className="px-6 py-4 text-center border-b dark:border-gray-800">Cor</th>
              <th className="px-6 py-4 border-b dark:border-gray-800">Qtd. Restante</th>
              <th className="px-6 py-4 border-b dark:border-gray-800">Custo / Un</th>
              <th className="px-6 py-4 text-right border-b dark:border-gray-800">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {materiais.map((mat) => {
              const status = getEstoqueStatus(mat);
              const rowBg = !mat.ativo
                ? 'opacity-40 grayscale bg-gray-50 dark:bg-gray-900'
                : status === 'critico'
                ? 'bg-red-50 dark:bg-red-500/5'
                : status === 'baixo'
                ? 'bg-yellow-50 dark:bg-yellow-500/5'
                : '';

              return (
                <tr key={mat.id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${rowBg}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-[#2A3240] dark:text-gray-200">{mat.tipo}</div>
                      {status === 'critico' && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-red-500 text-white rounded-full animate-pulse">Crítico</span>
                      )}
                      {status === 'baixo' && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-yellow-500 text-white rounded-full">Baixo</span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">{mat.marca?.nome || 'Marca não informada'}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner mb-1" style={{ backgroundColor: mat.cor?.hex || '#ccc' }}></div>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{mat.cor?.nome || 'S/ Cor'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-xs font-black ${
                        status === 'critico' ? 'text-red-600 dark:text-red-400' : status === 'baixo' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {mat.quantidade_restante}{mat.unidade}
                      </span>
                      {mat.ativo && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 max-w-[80px]">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                status === 'critico' ? 'bg-red-500' : status === 'baixo' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(100, (parseFloat(mat.quantidade_restante) / Math.max(parseFloat(mat.estoque_minimo || 200) * 3, 1)) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">Mín: {mat.estoque_minimo || 200}{mat.unidade}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-600 dark:text-gray-400">R$ {mat.custo_unidade}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      {mat.ativo && (
                        <button 
                          onClick={() => onCompra(mat)} 
                          title="Registrar Compra"
                          className="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      )}
                      <button onClick={() => onEdit(mat)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button onClick={() => handleToggleAtivo(mat)} className={`${mat.ativo ? 'text-gray-300 dark:text-gray-600 hover:text-red-500' : 'text-green-500 hover:text-green-700'} transition-colors`}>
                        {mat.ativo ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" /></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
