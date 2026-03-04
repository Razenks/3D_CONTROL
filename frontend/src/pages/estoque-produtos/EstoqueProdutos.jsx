import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaEstoqueProdutos from './components/TabelaEstoqueProdutos';
import ModalNovoProduto from './components/ModalNovoProduto';

export default function EstoqueProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aumenta a quantidade
  const handleIncrementarQuantidade = (id) => {
    setProdutos((prev) => prev.map((prod) => prod.id === id ? { ...prod, quantidade: prod.quantidade + 1 } : prod));
    // fetch POST para atualizar no banco...
  };

  // Diminui a quantidade (Simulação de Venda)
  const handleDecrementarQuantidade = (id) => {
    setProdutos((prev) => prev.map((prod) => {
      if (prod.id === id && prod.quantidade > 0) {
        return { ...prod, quantidade: prod.quantidade - 1 };
      }
      return prod;
    }));
    // fetch POST para atualizar no banco...
  };

  // Lógica ao Salvar o Formulário do Modal
  const handleSalvarProduto = (dadosFormulario) => {
    // Cálculo básico de preço final baseado no custo e % de lucro
    const custo = parseFloat(dadosFormulario.custoMaterial);
    const lucro = parseFloat(dadosFormulario.margemLucro) / 100;
    const precoCalculado = custo + (custo * lucro);

    const novoProduto = {
      id: Date.now(), // Simula um ID gerado pelo banco
      nome: dadosFormulario.nome,
      material: 'A Definir', // Futuramente pode vir de um select no modal
      cor: 'Padrão',
      hexCor: '#cccccc',
      preco: precoCalculado, 
      dataFabricacao: dadosFormulario.dataFabricacao.split('-').reverse().join('/'), // Formata YYYY-MM-DD para DD/MM/YYYY
      quantidade: 1 // Inicia com 1 no estoque
    };

    setProdutos([novoProduto, ...produtos]);
    setIsModalOpen(false);
    
    // Futuramente: fetch POST para inserir no banco PHP
    console.log("Novo produto salvo:", novoProduto);
  };

  useEffect(() => {
    // Mock inicial de dados
    setTimeout(() => {
      setProdutos([
        { id: 1, nome: 'Suporte de Headset Articulado', material: 'PLA', cor: 'Preto', hexCor: '#000000', preco: 45.90, quantidade: 12 },
        { id: 2, nome: 'Vaso Decorativo Low Poly', material: 'PETG', cor: 'Branco', hexCor: '#FFFFFF', preco: 35.00, quantidade: 5 },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">Estoque de Produtos Acabados</h2>
          <p className="text-sm text-gray-600 mt-1">Dê baixa nas vendas ou cadastre novos itens impressos.</p>
        </div>
        
        {/* Botão que abre o Modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Carregando estoque...</div>
      ) : (
        <TabelaEstoqueProdutos 
          produtos={produtos} 
          onIncrementarQuantidade={handleIncrementarQuantidade} 
          onDecrementarQuantidade={handleDecrementarQuantidade}
        />
      )}

      {/* Renderização do Modal */}
      <ModalNovoProduto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSalvar={handleSalvarProduto} 
      />
    </Layout>
  );
}