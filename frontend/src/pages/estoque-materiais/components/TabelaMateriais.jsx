import React from 'react';
import API_BASE_URL from '../../../config';

export default function TabelaMateriais({ materiais, loading, onRefresh, onEdit }) {
  
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
            {materiais.map((mat) => (
              <tr key={mat.id} className={`hover:bg-gray-50/50 transition-colors ${!mat.ativo ? 'opacity-40 grayscale bg-gray-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="font-bold text-[#2A3240]">{mat.tipo}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-black">{mat.marca?.nome || 'Marca não informada'}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full border border-gray-200 shadow-inner mb-1" style={{ backgroundColor: mat.cor?.hex || '#ccc' }}></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{mat.cor?.nome || 'S/ Cor'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-black text-gray-600">{mat.quantidade_restante}{mat.unidade}</span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-600">R$ {mat.custo_unidade}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEdit(mat)} className="text-gray-400 hover:text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => handleToggleAtivo(mat)} className={`${mat.ativo ? 'text-gray-300' : 'text-green-500'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
