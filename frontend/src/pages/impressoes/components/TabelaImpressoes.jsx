import React, { useState } from 'react';
import ModalGerenciarImpressao from './ModalGerenciarImpressao';

export default function TabelaImpressoes({ titulo, dados, isHistorico = false, onRefresh }) {
  const [modalGerenciarAberto, setModalGerenciarAberto] = useState(false);
  const [impressaoSelecionada, setImpressaoSelecionada] = useState(null);

  const getStatusEstilo = (status) => {
    switch (status) {
      case 'fila': return 'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
      case 'fatiando': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      case 'imprimindo': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'pausado': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
      case 'concluido': return 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'falha': return 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20';
      default: return 'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
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
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 flex justify-between items-center">
        <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">{titulo}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">Total: {dados.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800 uppercase tracking-widest">
              <th className="px-6 py-4 hidden sm:table-cell">Máquina</th>
              <th className="px-6 py-4">Projeto / Arquivo</th>
              <th className="px-6 py-4 text-center">Unidades</th>
              <th className="px-6 py-4 hidden md:table-cell">Tempo Rest.</th>
              {!isHistorico && <th className="px-6 py-4 hidden lg:table-cell">Progresso Lote</th>}
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
            {dados.length > 0 ? (
              dados.map((impressao) => (
                <tr key={impressao.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="font-bold text-[#2A3240] dark:text-gray-200">{impressao.impressora?.nome || 'N/A'}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-[10px] uppercase font-black">{impressao.impressora?.modelo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#2A3240] dark:text-gray-200 truncate max-w-[120px] sm:max-w-none" title={impressao.projeto_nome}>{impressao.projeto_nome}</div>
                    <div className="text-gray-500 dark:text-gray-500 text-[10px] uppercase font-black tracking-tight">
                        {impressao.cliente?.nome || (impressao.orcamento_id ? 'Vinc. Orçamento' : 'Avulso')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                        <span className="bg-orange-50 dark:bg-orange-500/10 text-[#FF9B54] px-2 py-1 rounded-md font-black text-xs whitespace-nowrap border border-orange-100 dark:border-orange-500/20">
                            {impressao.quantidade_concluida || 0} / {impressao.quantidade || 1}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-bold hidden md:table-cell">
                    {calcularTempoTotal(impressao.tempo_estimado, (impressao.quantidade - (impressao.quantidade_concluida || 0)))}
                  </td>

                  {!isHistorico && (
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 max-w-20 overflow-hidden shadow-inner">
                          <div
                            className="bg-[#FF9B54] h-1.5 rounded-full transition-all"
                            style={{ width: `${impressao.progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-[#FF9B54]">{impressao.progresso}%</span>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${getStatusEstilo(impressao.status)}`}>
                      {traduzirStatus(impressao.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {!isHistorico ? (
                        <button 
                            onClick={() => abrirModalGerenciar(impressao)}
                            className="bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-md shadow-orange-500/10 uppercase tracking-widest"
                        >
                          Gerenciar
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600 font-black text-[9px] uppercase italic tracking-widest bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded border dark:border-gray-700/50">Finalizado</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isHistorico ? 6 : 7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600 italic font-bold uppercase text-[10px] tracking-[2px]">
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
