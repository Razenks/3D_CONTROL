import React from 'react';

export default function TabelaMateriais({ materiais, loading, onRefresh, onEdit }) {
  
  const handleToggleAtivo = async (material) => {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await fetch(`http://localhost:8000/api/materiais/${material.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ativo: !material.ativo })
        });
        if (response.ok) onRefresh();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-10 text-gray-400 font-bold uppercase animate-pulse">Carregando...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Material / Marca</th>
              <th className="px-6 py-4 text-center">Cor</th>
              <th className="px-6 py-4">Qtd. Restante</th>
              <th className="px-6 py-4">Custo / Un</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {materiais.length > 0 ? (
              materiais.map((mat) => (
                <tr key={mat.id} className={`hover:bg-gray-50/50 transition-colors ${!mat.ativo ? 'opacity-40 grayscale bg-gray-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#2A3240]">{mat.tipo}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black">{mat.marca?.nome || 'Marca não informada'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-5 h-5 rounded-full border border-gray-200 shadow-inner mb-1" style={{ backgroundColor: mat.cor?.hex || '#ccc' }}></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{mat.cor?.nome || 'S/ Cor'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[60px]">
                        <div className={`h-1.5 rounded-full ${mat.quantidade_restante < 200 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(mat.quantidade_restante / 1000) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-gray-600">{mat.quantidade_restante}{mat.unidade}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-600 text-sm">R$ {mat.custo_unidade}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                        <button onClick={() => onEdit(mat)} className="text-gray-400 hover:text-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        
                        <button 
                            onClick={() => handleToggleAtivo(mat)} 
                            className={`${mat.ativo ? 'text-gray-300 hover:text-red-500' : 'text-green-500 hover:text-green-700'} transition-colors`}
                            title={mat.ativo ? 'Desativar' : 'Ativar'}
                        >
                            {mat.ativo ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">Sem materiais no estoque.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
