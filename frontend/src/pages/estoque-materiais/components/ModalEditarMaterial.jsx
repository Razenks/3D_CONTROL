import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalEditarMaterial({ isOpen, onClose, material, onSucesso }) {
  const [formData, setFormData] = useState({
    tipo: '',
    marca_id: '',
    cor_id: '',
    custo_unidade: '',
    quantidade_restante: '',
    unidade: 'g'
  });

  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && material) {
      setFormData({
        tipo: material.tipo || '',
        marca_id: material.marca_id || '',
        cor_id: material.cor_id || '',
        custo_unidade: material.custo_unidade || '',
        quantidade_restante: material.quantidade_restante || '',
        unidade: material.unidade || 'g'
      });
      fetchExtras();
    }
  }, [isOpen, material]);

  const fetchExtras = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const [resM, resC] = await Promise.all([
        fetch(`${API_BASE_URL}/api/marcas`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/cores`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (resM.ok) setMarcas(await resM.json());
      if (resC.ok) setCores(await resC.json());
    } catch (err) {
      console.error('Erro ao buscar marcas/cores:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/materiais/${material.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSucesso();
        onClose();
      } else {
        alert('Erro ao atualizar material.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-t-8 border-blue-600">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#2A3240]">Editar Insumo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Tipo</label>
              <select 
                value={formData.tipo} 
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              >
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
                <option value="Resina Standard">Resina Standard</option>
                <option value="Resina ABS-Like">Resina ABS-Like</option>
                <option value="TPU">TPU (Flexível)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Marca</label>
              <select 
                value={formData.marca_id} 
                onChange={(e) => setFormData({...formData, marca_id: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              >
                {marcas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Cor</label>
              <div className="flex gap-2 items-center">
                <select 
                  value={formData.cor_id} 
                  onChange={(e) => setFormData({...formData, cor_id: e.target.value})}
                  className="flex-1 min-w-0 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                >
                  {cores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Qtd. Restante ({formData.unidade})</label>
              <input 
                type="number" 
                value={formData.quantidade_restante} 
                onChange={(e) => setFormData({...formData, quantidade_restante: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Custo por KG/L (R$)</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.custo_unidade} 
              onChange={(e) => setFormData({...formData, custo_unidade: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-black text-gray-500 uppercase">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-3 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all uppercase tracking-widest shadow-lg">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
