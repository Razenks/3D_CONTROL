import React, { useState } from 'react';
import ModalVenderProduto from './ModalVenderProduto';

export default function TabelaEstoqueProdutos({ produtos, loading, onRefresh, onEdit }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalVendaOpen, setIsModalVendaOpen] = useState(false);

  const handleToggleAtivo = async (produto) => {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await fetch(`http://localhost:8000/api/produtos/${produto.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ ativo: !produto.ativo })
        });
        if (response.ok) onRefresh();
    } catch (err) { console.error(err); }
  };

  const handleVenderClick = (prod) => {
    setProdutoSelecionado(prod);
    setIsModalVendaOpen(true);
  };

  if (loading) return <div className="p-10 text-center text-gray-400 font-bold uppercase animate-pulse">Carregando...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Produto / Fabricação</th>
              <th className="px-6 py-4 text-center">Disponível</th>
              <th className="px-6 py-4 text-right">Valor de Venda</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtos.length > 0 ? (
              produtos.map((prod) => (
                <tr key={prod.id} className={`hover:bg-gray-50/50 transition-colors ${!prod.ativo ? 'opacity-40 grayscale bg-gray-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#2A3240]">{prod.nome}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Fab: {new Date(prod.data_fabricacao).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-gray-600">
                    <span className={`px-2 py-1 rounded-lg ${prod.quantidade > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {prod.quantidade} un
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sugerido</span>
                        <span className="text-sm font-black text-[#2A3240]">R$ {(prod.custo_material * (1 + (prod.margem_lucro / 100))).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 items-center">
                        <button onClick={() => onEdit(prod)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>

                        <button 
                            onClick={() => handleToggleAtivo(prod)} 
                            className={`${prod.ativo ? 'text-gray-300 hover:text-red-500' : 'text-green-500 hover:text-green-700'} transition-colors`}
                            title={prod.ativo ? 'Desativar' : 'Ativar'}
                        >
                            {prod.ativo ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                        </button>

                        <button 
                            disabled={prod.quantidade <= 0 || !prod.ativo}
                            onClick={() => handleVenderClick(prod)}
                            className="bg-[#FF9B54] hover:bg-orange-500 text-[#2A3240] font-black py-2 px-4 rounded-lg text-[10px] uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
                        >
                            Vender
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">Estoque vazio.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalVenderProduto isOpen={isModalVendaOpen} onClose={() => setIsModalVendaOpen(false)} produto={produtoSelecionado} onSucesso={onRefresh} />
    </div>
  );
}
