import React, { useState } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalNovaCor({ isOpen, onClose, onSucesso }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    hex: '#FF9B54'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch(`${API_BASE_URL}/api/cores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        onSucesso();
        onClose();
        setFormData({ codigo: '', nome: '', hex: '#FF9B54' });
      } else {
        const err = await res.json();
        alert(err.message || 'Erro ao cadastrar cor');
      }
    } catch (err) {
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border-t-8 border-[#FF9B54]">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-black text-[#2A3240] uppercase">Nova Cor</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Código (Número)</label>
            <input
              required
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
              placeholder="Ex: 01"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome da Cor</label>
            <input
              required
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
              placeholder="Ex: Preto"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Selecione na Paleta</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={formData.hex}
                onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
              />
              <span className="font-mono font-bold text-[#2A3240] uppercase">{formData.hex}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A3240] hover:bg-gray-800 text-white font-black py-3 rounded-xl shadow-xl transition-all uppercase text-xs tracking-widest"
          >
            {loading ? 'Cadastrando...' : 'Salvar Cor'}
          </button>
        </form>
      </div>
    </div>
  );
}
