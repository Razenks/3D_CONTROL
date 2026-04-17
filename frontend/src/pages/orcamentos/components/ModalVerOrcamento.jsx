import React from 'react';

export default function ModalVerOrcamento({ isOpen, onClose, orcamento }) {
  if (!isOpen || !orcamento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border dark:border-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-[#2A3240] text-white">
          <h3 className="text-xl font-black uppercase tracking-tight">Detalhes do Orçamento ORC-{orcamento.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto transition-colors duration-300">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Cliente</label>
              <p className="text-[#2A3240] dark:text-gray-200 font-bold text-lg">{orcamento.cliente_rel ? orcamento.cliente_rel.nome : (orcamento.cliente || 'Consumidor Final')}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Projeto / Produto</label>
              <p className="text-[#2A3240] dark:text-gray-200 font-bold text-lg">{orcamento.projeto}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Data de Criação</label>
              <p className="text-[#2A3240] dark:text-gray-300 font-semibold">{new Date(orcamento.created_at).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Status Atual</label>
              <p className="font-black uppercase text-[#FF9B54]">{orcamento.status}</p>
            </div>
          </div>

          {orcamento.status === 'Rejeitado' && orcamento.motivo_rejeicao && (
            <div className="bg-red-50 dark:bg-red-500/5 border-l-4 border-red-500 p-4 rounded-r-lg animate-in slide-in-from-left duration-300">
              <label className="block text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">Motivo da Rejeição</label>
              <p className="text-red-800 dark:text-red-300 font-bold text-sm italic">
                "{orcamento.motivo_rejeicao}"
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h4 className="text-sm font-black text-gray-700 dark:text-gray-400 uppercase mb-4 tracking-widest">Resumo Financeiro</h4>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border dark:border-gray-800">
              <div className="text-center">
                <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Custo</span>
                <span className="text-red-500 dark:text-red-400 font-black text-xl">R$ {parseFloat(orcamento.custo_estimado).toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Lucro</span>
                <span className="text-green-500 dark:text-green-400 font-black text-xl">R$ {parseFloat(orcamento.lucro_estimado).toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black text-gray-400 uppercase mb-1">Venda</span>
                <span className="text-[#FF9B54] font-black text-xl">R$ {parseFloat(orcamento.valor_total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {orcamento.detalhes_calculo && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h4 className="text-sm font-black text-gray-700 dark:text-gray-400 uppercase mb-4 tracking-widest">Variáveis do Cálculo</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
                <div className="bg-gray-50 dark:bg-gray-800/20 p-3 rounded-lg">
                  <span className="text-gray-400 dark:text-gray-500 block uppercase mb-1">Peso</span>
                  <span className="text-[#2A3240] dark:text-gray-200 font-black">{orcamento.detalhes_calculo.peso}g</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/20 p-3 rounded-lg">
                  <span className="text-gray-400 dark:text-gray-500 block uppercase mb-1">Tempo</span>
                  <span className="text-[#2A3240] dark:text-gray-200 font-black">{orcamento.detalhes_calculo.horas}h {orcamento.detalhes_calculo.minutos}m</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/20 p-3 rounded-lg">
                  <span className="text-gray-400 dark:text-gray-500 block uppercase mb-1">Margem</span>
                  <span className="text-[#2A3240] dark:text-gray-200 font-black">{orcamento.detalhes_calculo.margem}%</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/20 p-3 rounded-lg">
                  <span className="text-gray-400 dark:text-gray-500 block uppercase mb-1">Matéria Prima</span>
                  <span className="text-[#2A3240] dark:text-gray-200 font-black">R$ {orcamento.detalhes_calculo.precoFilamento}/kg</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800/20 border-t dark:border-gray-800 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-700 dark:hover:bg-orange-600 text-white font-black rounded-xl shadow-lg transition-all uppercase text-xs tracking-widest">
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
