import React from 'react';

export default function ModalVerOrcamento({ isOpen, onClose, orcamento }) {
  if (!isOpen || !orcamento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#2A3240] text-white">
          <h3 className="text-xl font-bold uppercase tracking-tight">Detalhes do Orçamento ORC-{orcamento.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cliente</label>
              <p className="text-[#2A3240] font-semibold">{orcamento.cliente_rel ? orcamento.cliente_rel.nome : (orcamento.cliente || 'Consumidor Final')}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Projeto / Produto</label>
              <p className="text-[#2A3240] font-semibold">{orcamento.projeto}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data de Criação</label>
              <p className="text-[#2A3240] font-semibold">{new Date(orcamento.created_at).toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status Atual</label>
              <p className="font-bold">{orcamento.status}</p>
            </div>
          </div>

          {orcamento.status === 'Rejeitado' && orcamento.motivo_rejeicao && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in slide-in-from-left duration-300">
              <label className="block text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Motivo da Rejeição</label>
              <p className="text-red-800 font-bold text-sm italic">
                "{orcamento.motivo_rejeicao}"
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-gray-700 uppercase mb-4">Resumo Financeiro</h4>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Custo</span>
                <span className="text-red-500 font-extrabold text-lg">R$ {parseFloat(orcamento.custo_estimado).toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Lucro</span>
                <span className="text-green-500 font-extrabold text-lg">R$ {parseFloat(orcamento.lucro_estimado).toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Venda</span>
                <span className="text-[#FF9B54] font-extrabold text-lg">R$ {parseFloat(orcamento.valor_total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {orcamento.detalhes_calculo && (
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-bold text-gray-700 uppercase mb-4">Variáveis do Cálculo</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Peso:</span>
                  <span className="font-semibold">{orcamento.detalhes_calculo.peso}g</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Tempo:</span>
                  <span className="font-semibold">{orcamento.detalhes_calculo.horas}h {orcamento.detalhes_calculo.minutos}m</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Margem:</span>
                  <span className="font-semibold">{orcamento.detalhes_calculo.margem}%</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Preço Filamento:</span>
                  <span className="font-semibold">R$ {orcamento.detalhes_calculo.precoFilamento}/kg</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#2A3240] text-white font-bold rounded-lg shadow-sm hover:bg-gray-700 transition-colors uppercase text-sm">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
