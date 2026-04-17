import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalRegistrarCompra({ isOpen, onClose, material, onSucesso }) {
  const [formData, setFormData] = useState({
    quantidade: '1',
    custo_unidade: '',
    fornecedor: '',
    observacao: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (material) {
      setFormData(prev => ({
        ...prev,
        custo_unidade: material.custo_unidade || ''
      }));
    }
  }, [material, isOpen]);

  if (!isOpen || !material) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/materiais/${material.id}/comprar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSucesso();
        onClose();
      } else {
        const err = await response.json();
        alert('Erro ao registrar compra: ' + (err.message || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ao registrar compra');
    } finally {
      setLoading(false);
    }
  };

  const total = (parseFloat(formData.quantidade || 0) * parseFloat(formData.custo_unidade || 0)).toFixed(2);
  const unidadeCompra = (material.unidade === 'g') ? 'kg' : (material.unidade === 'ml') ? 'L' : material.unidade;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-green-500">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-[#2A3240]">Registrar Compra</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{material.tipo} - {material.cor?.nome} ({material.marca?.nome})</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qtd. Comprada ({unidadeCompra})</label>
              <input 
                type="number" 
                name="quantidade" 
                required 
                step="0.01"
                value={formData.quantidade} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-green-500" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Preço por {unidadeCompra} (R$)</label>
              <input 
                type="number" 
                name="custo_unidade" 
                required 
                step="0.01"
                value={formData.custo_unidade} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
            <span className="text-xs font-bold text-green-700 uppercase">Valor Total da Compra</span>
            <span className="text-xl font-black text-green-600">R$ {total}</span>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fornecedor</label>
            <input 
              type="text" 
              name="fornecedor" 
              value={formData.fornecedor} 
              onChange={handleChange} 
              placeholder="Ex: 3D Prime, GTMax..."
              className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Observações</label>
            <textarea 
              name="observacao" 
              rows="2"
              value={formData.observacao} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Cancelar</button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-4 text-xs font-black text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processando...' : 'Confirmar Compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
