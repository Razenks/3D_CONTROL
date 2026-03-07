import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaEstoqueProdutos from './components/TabelaEstoqueProdutos';
import ModalNovoProduto from './components/ModalNovoProduto';
import ModalEditarProduto from './components/ModalEditarProduto';

export default function EstoqueProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarEsgotados, setMostrarEsgotados] = useState(false);

  const fetchProdutos = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch('http://localhost:8000/api/produtos', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setProdutos(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProdutos(); }, []);

  // Filtra produtos: Ativos e com quantidade > 0 para a visão principal
  const produtosVisiveis = produtos.filter(p => {
    if (mostrarEsgotados) return true; // Mostra tudo se o filtro estiver ativo
    return p.ativo && p.quantidade > 0;
  });

  const handleEdit = (prod) => {
    setProdutoSelecionado(prod);
    setIsEditModalOpen(true);
  };

  const handleSalvarNovo = async (dados) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch('http://localhost:8000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (response.ok) fetchProdutos();
    } catch (err) { console.error(err); }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">Estoque de Produtos</h2>
          <p className="text-sm text-gray-500 font-medium">Itens prontos para venda imediata.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
                type="checkbox" 
                checked={mostrarEsgotados} 
                onChange={(e) => setMostrarEsgotados(e.target.checked)}
                className="w-4 h-4 text-[#FF9B54] border-gray-300 rounded focus:ring-[#FF9B54]"
            />
            <span className="text-xs font-bold text-gray-500 uppercase">Mostrar Esgotados / Inativos</span>
          </label>

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-[#2A3240] hover:bg-gray-800 text-white font-black py-3 px-8 rounded-xl shadow-lg uppercase text-xs tracking-widest transition-all"
          >
            + Novo Produto
          </button>
        </div>
      </div>

      <TabelaEstoqueProdutos 
        produtos={produtosVisiveis} 
        loading={loading} 
        onRefresh={fetchProdutos} 
        onEdit={handleEdit} 
      />

      <ModalNovoProduto isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSalvar={handleSalvarNovo} />
      <ModalEditarProduto isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} produto={produtoSelecionado} onSucesso={fetchProdutos} />
    </Layout>
  );
}
