import React, { useState } from 'react';
import ModalEditarProduto from './ModalEditarProduto';
import ModalVenderProduto from './ModalVenderProduto';
import API_BASE_URL from '../../../config';

export default function TabelaEstoqueProdutos({ produtos, loading, onRefresh, onEdit }) {
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const handleToggleAtivo = async (p) => {
    const token = localStorage.getItem('auth_token');
    try {
        await fetch(`${API_BASE_URL}/api/produtos/${p.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ativo: !p.ativo })
        });
        onRefresh();
    } catch (err) { console.error(err); }
  };

  const handleVenda = (p) => {
    setProdutoSelecionado(p);
    setModalVendaAberto(true);
  };

  if (loading) return <div className="text-center py-10 font-black text-gray-400 animate-pulse uppercase tracking-widest">Sincronizando Estoque...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Produto / Material</th>
              <th className="px-6 py-4 text-center">Estoque</th>
              <th className="px-6 py-4">Preço Sugerido</th>
              <th className="px-6 py-4">Margem</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtos.length > 0 ? (
              produtos.map((p) => {
                const precoVenda = p.custo_material * (1 + (p.margem_lucro / 100));
                return (
                  <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${!p.ativo ? 'opacity-40 grayscale bg-gray-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-black text-[#2A3240] text-sm uppercase">{p.nome}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.material_hex_cor || '#ccc' }}></div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{p.material_nome} {p.material_cor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${p.quantidade > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.quantidade} un
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-[#2A3240]">R$ {precoVenda.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-400 font-bold">Custo: R$ {parseFloat(p.custo_material).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-[#FF9B54] text-sm">{p.margem_lucro}%</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                            disabled={p.quantidade <= 0}
                            onClick={() => handleVenda(p)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shadow-md disabled:opacity-30"
                        >Vender</button>
                        
                        <button onClick={() => onEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>

                        <button onClick={() => handleToggleAtivo(p)} className={`p-2 ${p.ativo ? 'text-gray-300 hover:text-red-500' : 'text-green-500 hover:text-green-700'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">Sem produtos para exibir.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalVenderProduto 
        isOpen={modalVendaAberto} 
        onClose={() => setModalVendaAberto(false)} 
        produto={produtoSelecionado} 
        onSucesso={onRefresh} 
      />
    </div>
  );
}
