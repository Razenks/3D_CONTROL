import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

export default function CatalogoProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', peso_padrao: '', tempo_padrao: '' });

  const fetchProdutos = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch('http://localhost:8000/api/produtos-catalogo', {
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
    try {
      const response = await fetch('http://localhost:8000/api/produtos-catalogo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchProdutos();
        setIsModalOpen(false);
        setFormData({ nome: '', peso_padrao: '', tempo_padrao: '' });
      }
    } catch (err) { console.error(err); }
  };

  const deleteProduto = async (id) => {
    if (!confirm('Excluir este modelo?')) return;
    const token = localStorage.getItem('auth_token');
    try {
      await fetch(`http://localhost:8000/api/produtos-catalogo/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProdutos();
    } catch (err) { console.error(err); }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">Catálogo de Modelos</h2>
          <p className="text-sm text-gray-600">Cadastre produtos recorrentes para facilitar o lançamento de impressões.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2A3240] text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all"
        >
          Novo Modelo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Nome do Produto</th>
              <th className="px-6 py-4 text-center">Peso Padrão (1 un)</th>
              <th className="px-6 py-4 text-center">Tempo Padrão (1 un)</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {produtos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#2A3240]">{p.nome}</td>
                <td className="px-6 py-4 text-center font-medium text-gray-600">{p.peso_padrao}g</td>
                <td className="px-6 py-4 text-center font-medium text-gray-600">{p.tempo_padrao}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteProduto(p.id)} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Cadastrar Modelo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nome do Produto</label>
                <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: Chaveiro Logo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Peso (g)</label>
                  <input required type="number" value={formData.peso_padrao} onChange={e => setFormData({...formData, peso_padrao: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Tempo (Ex: 1h 30m)</label>
                  <input required type="text" value={formData.tempo_padrao} onChange={e => setFormData({...formData, tempo_padrao: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="0h 45m" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-lg font-bold text-gray-500">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-[#FF9B54] text-white rounded-lg font-bold">Salvar Modelo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
