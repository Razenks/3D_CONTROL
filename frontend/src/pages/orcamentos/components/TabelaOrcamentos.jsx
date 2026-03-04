import React from 'react';

export default function TabelaOrcamentos({ titulo, dados, isHistorico = false }) {
  // Função auxiliar para definir a cor do badge de status
  const getStatusEstilo = (status) => {
    switch (status) {
      case 'Aguardando Análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Precificando':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-[#2A3240]">{titulo}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-white border-b border-gray-200">
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Cliente / Projeto</th>
              <th className="px-6 py-3 font-semibold">Data da Solicitação</th>
              {isHistorico && <th className="px-6 py-3 font-semibold">Valor Final</th>}
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {dados.length > 0 ? (
              dados.map((orcamento) => (
                <tr key={orcamento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#2A3240]">{orcamento.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2A3240]">{orcamento.cliente}</div>
                    <div className="text-gray-500 text-xs">{orcamento.projeto}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{orcamento.data}</td>
                  
                  {isHistorico && (
                    <td className="px-6 py-4 font-medium text-[#2A3240]">
                      {orcamento.valor ? `R$ ${orcamento.valor}` : '-'}
                    </td>
                  )}
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusEstilo(orcamento.status)}`}>
                      {orcamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isHistorico ? (
                      <button className="text-[#2A3240] hover:text-[#FF9B54] font-semibold text-sm transition-colors">
                        Ver Detalhes
                      </button>
                    ) : (
                      <button className="bg-[#2A3240] hover:bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                        Analisar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isHistorico ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                  Nenhum orçamento encontrado nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}