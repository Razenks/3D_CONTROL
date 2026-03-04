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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#FF9B54]">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-[#2A3240]">Enviar para Pronta Entrega</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Item:</span>
                            <span className="font-bold text-[#2A3240]">{dadosImpressao.arquivo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Máquina (Gasto):</span>
                            <span className="font-medium">{dadosImpressao.maquina} ({dadosImpressao.watts}W)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tempo Total:</span>
                            <span className="font-medium">{dadosImpressao.tempo}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                            <span className="text-[#2A3240] font-bold">Custo de Produção:</span>
                            <span className="text-[#2A3240] font-bold">R$ {(dadosImpressao.custoMaterial + dadosImpressao.custoEnergia).toFixed(2)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#2A3240] mb-1">Margem de Lucro (%)</label>
                        <input
                            type="number"
                            value={margem}
                            onChange={(e) => setMargem(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none"
                        />
                    </div>

                    <div className="bg-[#2A3240] p-4 rounded-lg text-center text-white">
                        <span className="block text-xs uppercase opacity-70 mb-1">Preço Sugerido de Venda</span>
                        <span className="text-2xl font-black text-[#FF9B54]">R$ {precoFinal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={() => onConfirmar({ ...dadosImpressao, precoVenda: precoFinal })}
                        className="w-full bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Confirmar e Adicionar ao Estoque
                    </button>
                </div>
            </div>
        </div>
    );
}