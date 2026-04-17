import React, { useState, useEffect } from 'react';

export default function ModalEstocarProduto({ isOpen, onClose, dadosImpressao, onConfirmar }) {
    const [margem, setMargem] = useState(250);
    const [precoFinal, setPrecoFinal] = useState(0);

    // Cálculo automático do preço baseado nos dados que vieram da produção
    useEffect(() => {
        if (dadosImpressao) {
            const custoTotal = (dadosImpressao.custoMaterial || 0) + (dadosImpressao.custoEnergia || 0);
            const calculo = custoTotal * (1 + margem / 100);
            setPrecoFinal(calculo);
        }
    }, [margem, dadosImpressao]);

    if (!isOpen || !dadosImpressao) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-gray-800 border-t-4 border-t-[#FF9B54] dark:border-t-[#FF9B54] animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20 flex justify-between items-center transition-colors">
          <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Enviar para Pronta Entrega</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5 transition-colors">
          <div className="bg-blue-50 dark:bg-blue-500/5 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 space-y-3 text-sm transition-colors">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Item:</span>
              <span className="font-black text-[#2A3240] dark:text-gray-200">{dadosImpressao.arquivo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Máquina (Gasto):</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{dadosImpressao.maquina} ({dadosImpressao.watts}W)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Tempo Total:</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{dadosImpressao.tempo}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 dark:border-blue-500/20 pt-3 mt-1">
              <span className="text-[#2A3240] dark:text-gray-200 font-black uppercase text-xs">Custo de Produção:</span>
              <span className="text-[#2A3240] dark:text-white font-black text-sm">R$ {(dadosImpressao.custoMaterial + dadosImpressao.custoEnergia).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Margem de Lucro (%)</label>
            <input
              type="number"
              value={margem}
              onChange={(e) => setMargem(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-black text-[#2A3240] dark:text-gray-200 text-lg transition-all"
            />
          </div>

          <div className="bg-[#2A3240] dark:bg-gray-800/80 p-6 rounded-2xl text-center text-white shadow-xl transition-all">
            <span className="block text-[10px] font-black uppercase tracking-[3px] text-[#FF9B54] mb-2">Preço Sugerido de Venda</span>
            <span className="text-4xl font-black text-white">R$ {precoFinal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => onConfirmar({ ...dadosImpressao, precoVenda: precoFinal })}
            className="w-full bg-[#FF9B54] hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/20 uppercase text-xs tracking-widest transition-all"
          >
            Confirmar e Adicionar ao Estoque
          </button>
        </div>
      </div>
    </div>
  );
}