import React, { useState } from 'react';
import ModalEstocarProduto from './ModalEstocarProduto';

export default function TabelaImpressoes({ titulo, dados, isHistorico = false }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [impressaoSelecionada, setImpressaoSelecionada] = useState(null);

  const getStatusEstilo = (status) => {
    switch (status) {
      case 'Na Fila': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Fatiando': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Imprimindo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pausado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
      case 'Falha': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const abrirModalEstoque = (impressao) => {
    // Aqui simulamos o cálculo que viria do backend baseado nos dados da peça
    const dadosCompletos = {
      ...impressao,
      watts: 150, // Exemplo vindo da configuração da máquina
      custoMaterial: 12.50, // Simulação baseada nas gramas gastas
      custoEnergia: 1.80    // Simulação baseada no tempo x Watts
    };
    setImpressaoSelecionada(dadosCompletos);
    setModalAberto(true);
  };

  const handleConfirmarEstoque = (dadosFinais) => {
    console.log("Enviando para o Estoque de Produtos:", dadosFinais);
    setModalAberto(false);
    // Aqui você faria o fetch para o seu PHP
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#2A3240]">{titulo}</h3>
        <span className="text-sm text-gray-500 font-medium">Total: {dados.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-white border-b border-gray-200">
              <th className="px-6 py-3 font-semibold">Máquina</th>
              <th className="px-6 py-3 font-semibold">Arquivo / Item</th>
              <th className="px-6 py-3 font-semibold">Material</th>
              <th className="px-6 py-3 font-semibold">Tempo Estimado</th>
              {!isHistorico && <th className="px-6 py-3 font-semibold">Progresso</th>}
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {dados.length > 0 ? (
              dados.map((impressao) => (
                <tr key={impressao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#2A3240]">{impressao.maquina}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2A3240]">{impressao.arquivo}</div>
                    <div className="text-gray-500 text-xs">Pedido: {impressao.pedidoId}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{impressao.material}</td>
                  <td className="px-6 py-4 text-gray-600">{impressao.tempo}</td>

                  {!isHistorico && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-20">
                          <div
                            className="bg-[#FF9B54] h-2.5 rounded-full transition-all"
                            style={{ width: `${impressao.progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{impressao.progresso}%</span>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusEstilo(impressao.status)}`}>
                      {impressao.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Botão Estocar: Só aparece se estiver concluído */}
                      {(impressao.progresso === 100 || impressao.status === 'Concluído') && (
                        <button
                          onClick={() => abrirModalEstoque(impressao)}
                          className="bg-[#FF9B54] hover:bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          Estocar
                        </button>
                      )}

                      {isHistorico ? (
                        <button className="text-[#2A3240] hover:text-[#FF9B54] font-semibold text-sm transition-colors">
                          Ver Relatório
                        </button>
                      ) : (
                        <button className="bg-[#2A3240] hover:bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                          Gerenciar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isHistorico ? 6 : 7} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma impressão nesta lista.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalEstocarProduto
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        dadosImpressao={impressaoSelecionada}
        onConfirmar={handleConfirmarEstoque}
      />
    </div>
  );
}