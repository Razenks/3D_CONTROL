import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalVenderProduto({ isOpen, onClose, produto, onSucesso }) {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
      setQuantidade(1);
    }
  }, [isOpen]);

  const fetchClientes = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/clientes?ativos_only=1`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
      });
      if (res.ok) setClientes(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleVenda = async (e) => {
    e.preventDefault();
    if (!metodoPagamento) {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      if (quantidade > produto.quantidade) {
        alert(`Estoque insuficiente! Você possui apenas ${produto.quantidade} unidades.`);
        setLoading(false);
        return;
      }

      const valorUnitario = (produto.custo_material * (1 + (produto.margem_lucro / 100)));
      const custoUnitario = produto.custo_material;
      
      const payload = {
        cliente_id: clienteId || null,
        cliente: clientes.find(c => c.id === parseInt(clienteId))?.nome || 'Consumidor Final',
        projeto: `VENDA (${quantidade}x): ${produto.nome}`,
        valor_total: valorUnitario * quantidade,
        custo_estimado: custoUnitario * quantidade,
        lucro_estimado: (valorUnitario - custoUnitario) * quantidade,
        status: 'Finalizado',
        metodo_pagamento: metodoPagamento,
        detalhes_calculo: { item_estoque_id: produto.id, venda_direta: true, qtd: quantidade }
      };

      const resVenda = await fetch(`${API_BASE_URL}/api/orcamentos`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (resVenda.ok) {
        await fetch(`${API_BASE_URL}/api/produtos/${produto.id}/stock`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ action: 'remove', quantity: quantidade })
        });

        onSucesso();
        onClose();
        alert('Venda realizada com sucesso!');
      } else {
          const errorInfo = await resVenda.json();
          alert('Erro no servidor: ' + (errorInfo.message || 'Verifique os logs.'));
      }
    } catch (err) {
      alert('Erro de conexão ao processar venda.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-8 border-[#FF9B54]">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-xl font-black text-[#2A3240] uppercase tracking-tighter">Realizar Venda</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleVenda} className="p-8 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto em Estoque</span>
            <p className="text-xl font-bold text-[#2A3240]">{produto.nome}</p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Selecionar Cliente</label>
            <select 
              required
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
            >
              <option value="">Selecione o cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantidade</label>
              <input 
                type="number" 
                min="1" 
                max={produto.quantidade}
                required
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
              />
              <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Disponível: {produto.quantidade}</span>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valor Total</label>
              <div className="w-full px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl font-bold text-[#FF9B54]">
                R$ {((produto.custo_material * (1 + (produto.margem_lucro / 100))) * quantidade).toFixed(2)}
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Unit.: R$ {(produto.custo_material * (1 + (produto.margem_lucro / 100))).toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Forma de Pagamento</label>
            <select 
              required
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240] transition-all"
            >
              <option value="">Selecione...</option>
              <option value="PIX">PIX</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A3240] hover:bg-gray-800 text-white font-black py-4 rounded-xl shadow-xl transition-all uppercase text-xs tracking-widest"
          >
            {loading ? 'Processando...' : 'Confirmar Venda'}
          </button>
        </form>
      </div>
    </div>
  );
}
