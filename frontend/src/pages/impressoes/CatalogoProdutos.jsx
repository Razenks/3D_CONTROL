import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import API_BASE_URL from '../../config';

export default function CatalogoProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', peso_padrao: '', tempo_padrao: '', preco_venda: '' });

  const fetchProdutos = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/produtos-catalogo`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setProdutos(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProdutos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const url = editingId 
      ? `${API_BASE_URL}/api/produtos-catalogo/${editingId}`
      : `${API_BASE_URL}/api/produtos-catalogo`;
    
    try {
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchProdutos();
        closeModal();
      }
    } catch (err) { console.error(err); }
  };

  const handleEdit = (produto) => {
    setEditingId(produto.id);
    setFormData({
      nome: produto.nome,
      peso_padrao: produto.peso_padrao,
      tempo_padrao: produto.tempo_padrao,
      preco_venda: produto.preco_venda || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nome: '', peso_padrao: '', tempo_padrao: '', preco_venda: '' });
  };

  const deleteProduto = async (id) => {
    if (!confirm('Excluir este modelo?')) return;
    const token = localStorage.getItem('auth_token');
    try {
      await fetch(`${API_BASE_URL}/api/produtos-catalogo/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProdutos();
    } catch (err) { console.error(err); }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Catálogo de Modelos</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Cadastre produtos recorrentes para facilitar o lançamento de impressões.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-orange-500/10 transition-all uppercase text-xs tracking-widest"
        >
          + Novo Modelo
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px]">
                <th className="px-6 py-4">Nome do Produto</th>
                <th className="px-6 py-4 text-center">Peso Padrão (1 un)</th>
                <th className="px-6 py-4 text-center">Tempo Padrão (1 un)</th>
                <th className="px-6 py-4 text-center">Preço (1 un)</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {produtos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#2A3240] dark:text-gray-200">{p.nome}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600 dark:text-gray-400 text-xs">{p.peso_padrao}g</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600 dark:text-gray-400 text-xs">{p.tempo_padrao}</td>
                  <td className="px-6 py-4 text-center font-black text-[#FF9B54]">
                      {p.preco_venda ? `R$ ${parseFloat(p.preco_venda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => handleEdit(p)} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black text-[10px] uppercase tracking-widest transition-colors">Editar</button>
                      <button onClick={() => deleteProduto(p.id)} className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 font-black text-[10px] uppercase tracking-widest transition-colors">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-gray-800 animate-in zoom-in duration-200">
            <div className="px-6 py-4 bg-[#2A3240] text-white flex justify-between items-center">
                <h3 className="text-lg font-black uppercase tracking-tighter">{editingId ? 'Editar Modelo' : 'Cadastrar Modelo'}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 transition-colors">
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Nome do Produto</label>
                <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-bold text-[#2A3240] dark:text-gray-200 focus:border-[#FF9B54] transition-all" placeholder="Ex: Chaveiro Logo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Peso (g)</label>
                  <input required type="number" value={formData.peso_padrao} onChange={e => setFormData({...formData, peso_padrao: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-bold text-[#2A3240] dark:text-gray-200 focus:border-[#FF9B54] transition-all" placeholder="10" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Tempo (Ex: 1h 30m)</label>
                  <input required type="text" value={formData.tempo_padrao} onChange={e => setFormData({...formData, tempo_padrao: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-bold text-[#2A3240] dark:text-gray-200 focus:border-[#FF9B54] transition-all" placeholder="0h 45m" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Preço Sugerido (R$)</label>
                <input type="number" step="0.01" value={formData.preco_venda} onChange={e => setFormData({...formData, preco_venda: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-bold text-[#2A3240] dark:text-gray-200 focus:border-[#FF9B54] transition-all text-lg" placeholder="Ex: 25.00" />
                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-tighter">Este preço será sugerido ao lançar este item.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-[#FF9B54] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all">{editingId ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
