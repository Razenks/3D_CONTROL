import React, { useState, useEffect } from 'react';

export default function ModalEditarProduto({ isOpen, onClose, produto, onSucesso }) {
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    custo_material: '',
    margem_lucro: '',
    tempo_horas: ''
  });

  // Sincroniza dados sempre que o produto mudar ou o modal abrir
  useEffect(() => {
    if (produto && isOpen) {
      setFormData({
        nome: produto.nome || '',
        quantidade: produto.quantidade || '',
        custo_material: produto.custo_material || '',
        margem_lucro: produto.margem_lucro || '',
        tempo_horas: produto.tempo_horas || ''
      });
    }
  }, [produto, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`http://localhost:8000/api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onSucesso();
        onClose();
      }
    } catch (err) { alert('Erro ao atualizar produto.'); }
  };

  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-t-8 border-blue-500">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#2A3240]">Editar Produto em Estoque</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Nome do Produto</label>
            <input type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-[#2A3240]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Qtd. em Estoque</label>
              <input type="number" value={formData.quantidade} onChange={(e) => setFormData({...formData, quantidade: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-[#2A3240]" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Custo Base (R$)</label>
              <input type="number" step="0.01" value={formData.custo_material} onChange={(e) => setFormData({...formData, custo_material: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-[#2A3240]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Margem Lucro (%)</label>
              <input type="number" value={formData.margem_lucro} onChange={(e) => setFormData({...formData, margem_lucro: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-[#2A3240]" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Tempo Fab. (Horas)</label>
              <input type="number" step="0.1" value={formData.tempo_horas} onChange={(e) => setFormData({...formData, tempo_horas: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-[#2A3240]" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-black text-gray-500 uppercase">Cancelar</button>
            <button type="submit" className="px-8 py-3 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg uppercase tracking-widest">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
