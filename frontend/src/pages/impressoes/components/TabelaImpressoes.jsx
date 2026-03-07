import React, { useState } from 'react';
import ModalGerenciarImpressao from './ModalGerenciarImpressao';

export default function TabelaImpressoes({ titulo, dados, isHistorico = false, onRefresh }) {
  const [modalGerenciarAberto, setModalGerenciarAberto] = useState(false);
  const [impressaoSelecionada, setImpressaoSelecionada] = useState(null);

  const getStatusEstilo = (status) => {
    switch (status) {
      case 'fila': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'fatiando': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'imprimindo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'concluido': return 'bg-green-100 text-green-800 border-green-200';
      case 'falha': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const traduzirStatus = (status) => {
    const statusMap = {
        'fila': 'Na Fila',
        'fatiando': 'Fatiando',
        'imprimindo': 'Imprimindo',
        'pausado': 'Pausado',
        'concluido': 'Concluído',
        'falha': 'Falha'
    };
    return statusMap[status] || status;
  };

  const calcularTempoTotal = (tempoUn, qtd) => {
    if (!tempoUn || qtd <= 0) return '-';
    
    let totalMinutosUnidade = 0;
    
    if (typeof tempoUn === 'string') {
        const regexH = /(\d+)h/;
        const regexM = /(\d+)m/;
        const hMatch = tempoUn.match(regexH);
        const mMatch = tempoUn.match(regexM);
        
        if (hMatch) totalMinutosUnidade += parseInt(hMatch[1]) * 60;
        if (mMatch) totalMinutosUnidade += parseInt(mMatch[1]);
        
        // Se não deu match em h/m mas é um número na string
        if (!hMatch && !mMatch && !isNaN(parseFloat(tempoUn))) {
            totalMinutosUnidade = parseFloat(tempoUn) * 60;
        }
    } else if (typeof tempoUn === 'number') {
        totalMinutosUnidade = tempoUn * 60;
    }

    if (totalMinutosUnidade === 0) return '-';

    const totalMinutosGeral = totalMinutosUnidade * qtd;
    const hFinal = Math.floor(totalMinutosGeral / 60);
    const mFinal = Math.round(totalMinutosGeral % 60);
    
    return `${hFinal}h ${mFinal}m`;
  };

  const abrirModalGerenciar = (impressao) => {
    setImpressaoSelecionada(impressao);
    setModalGerenciarAberto(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#2A3240] uppercase tracking-tight">{titulo}</h3>
        <span className="text-sm text-gray-500 font-bold">Total: {dados.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-white border-b border-gray-200">
              <th className="px-6 py-3 font-semibold uppercase text-xs hidden sm:table-cell">Máquina</th>
              <th className="px-6 py-3 font-semibold uppercase text-xs">Projeto / Arquivo</th>
              <th className="px-6 py-3 font-semibold uppercase text-xs text-center">Unidades</th>
              <th className="px-6 py-3 font-semibold uppercase text-xs hidden md:table-cell">Tempo Rest.</th>
              {!isHistorico && <th className="px-6 py-3 font-semibold uppercase text-xs hidden lg:table-cell">Progresso Lote</th>}
              <th className="px-6 py-3 font-semibold uppercase text-xs">Status</th>
              <th className="px-6 py-3 font-semibold text-right uppercase text-xs">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {dados.length > 0 ? (
              dados.map((impressao) => (
                <tr key={impressao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="font-bold text-[#2A3240]">{impressao.impressora?.nome || 'N/A'}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-bold">{impressao.impressora?.modelo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2A3240] truncate max-w-[120px] sm:max-w-none" title={impressao.projeto_nome}>{impressao.projeto_nome}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-bold">
                        {impressao.cliente?.nome || (impressao.orcamento_id ? 'Vinc. Orçamento' : 'Avulso')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                        <span className="bg-orange-50 text-[#FF9B54] px-2 py-1 rounded-md font-black text-xs whitespace-nowrap">
                            {impressao.quantidade_concluida || 0} / {impressao.quantidade || 1}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium hidden md:table-cell">
                    {calcularTempoTotal(impressao.tempo_estimado, (impressao.quantidade - (impressao.quantidade_concluida || 0)))}
                  </td>

                  {!isHistorico && (
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-20">
                          <div
                            className="bg-[#FF9B54] h-1.5 rounded-full transition-all"
                            style={{ width: `${impressao.progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">{impressao.progresso}%</span>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusEstilo(impressao.status)}`}>
                      {traduzirStatus(impressao.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {!isHistorico ? (
                        <button 
                            onClick={() => abrirModalGerenciar(impressao)}
                            className="bg-[#2A3240] hover:bg-gray-800 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors uppercase"
                        >
                          Gerenciar
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold text-[10px] uppercase italic">Finalizado</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isHistorico ? 6 : 7} className="px-6 py-8 text-center text-gray-500 italic">
                  Nenhuma impressão nesta lista.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalGerenciarImpressao 
        isOpen={modalGerenciarAberto}
        onClose={() => setModalGerenciarAberto(false)}
        impressao={impressaoSelecionada}
        onSucesso={onRefresh}
      />
    </div>
  );
}
