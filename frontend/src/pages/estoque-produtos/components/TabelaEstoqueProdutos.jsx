import React from 'react';

export default function TabelaEstoqueProdutos({ produtos, onIncrementarQuantidade, onDecrementarQuantidade }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#2A3240]">Produtos a Pronta Entrega</h3>
        <span className="text-sm text-gray-500 font-medium">Total de Itens: {produtos.length}</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-white border-b border-gray-200">
              <th className="px-6 py-3 font-semibold">Produto</th>
              <th className="px-6 py-3 font-semibold">Material / Cor</th>
              <th className="px-6 py-3 font-semibold">Preço de Venda</th>
              <th className="px-6 py-3 font-semibold text-center">Quantidade</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {produtos.length > 0 ? (
              produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#2A3240]">{produto.nome}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-700">{produto.material}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: produto.hexCor || '#ccc' }}></span>
                      <span className="text-gray-500 text-xs">{produto.cor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-green-700">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </td>
                  
                  {/* Coluna de Quantidade com Subtrair e Adicionar */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onDecrementarQuantidade(produto.id)}
                        disabled={produto.quantidade === 0}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-[#2A3240] hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                        title="Venda / Diminuir Estoque"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold text-[#2A3240] w-8 text-center">
                        {produto.quantidade}
                      </span>
                      <button 
                        onClick={() => onIncrementarQuantidade(produto.id)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-[#FF9B54] text-white hover:bg-orange-500 transition-colors font-bold"
                        title="Adicionar ao estoque"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-[#2A3240] hover:text-[#FF9B54] font-semibold text-sm transition-colors mr-3">Editar</button>
                    <button className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors">Remover</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Nenhum produto em estoque.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}