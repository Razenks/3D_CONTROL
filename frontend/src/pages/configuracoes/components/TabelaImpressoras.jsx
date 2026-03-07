import React from 'react';

export default function TabelaImpressoras({ impressoras, loading, onDelete }) {
  if (loading) return <div className="text-center py-10 text-gray-400">Carregando máquinas...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nome/Máquina</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Conexão</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {impressoras.length > 0 ? (
              impressoras.map((imp) => (
                <tr key={imp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{imp.nome}</span>
                      <span className="text-xs text-gray-400 italic">{imp.ip_local || 'S/ IP Local'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{imp.modelo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      imp.status_atual === 'disponivel' ? 'bg-green-100 text-green-700' :
                      imp.status_atual === 'imprimindo' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {imp.status_atual || 'disponivel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{imp.tipo_conexao}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(imp.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic font-normal">
                  Nenhuma impressora cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
