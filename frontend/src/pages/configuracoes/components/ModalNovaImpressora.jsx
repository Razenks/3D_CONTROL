import React, { useState } from 'react';

export default function ModalNovaImpressora({ isOpen, onClose, onSucesso }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    modelo: '',
    ip_local: '',
    tipo_conexao: 'manual'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch('http://localhost:8000/api/impressoras', {
        method: 'POST',
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
        setFormData({ nome: '', modelo: '', ip_local: '', tipo_conexao: 'manual' });
      } else {
        const errorData = await response.json();
        alert('Erro ao cadastrar impressora: ' + (errorData.message || 'Dados inválidos.'));
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#2A3240] text-white">
          <h3 className="text-xl font-bold uppercase tracking-tight">Nova Máquina</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome de Identificação</label>
            <input
              required
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: Ender 3 Esquerda"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Modelo da Impressora</label>
            <input
              required
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              placeholder="Ex: Creality Ender 3 S1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">IP Local (Opcional)</label>
            <input
              type="text"
              value={formData.ip_local}
              onChange={(e) => setFormData({...formData, ip_local: e.target.value})}
              placeholder="Ex: 192.168.1.50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Conexão</label>
            <select
              value={formData.tipo_conexao}
              onChange={(e) => setFormData({...formData, tipo_conexao: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none"
            >
              <option value="manual">Manual / Offline</option>
              <option value="klipper">Mainsail / Klipper</option>
              <option value="octoprint">OctoPrint</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors uppercase text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#FF9B54] hover:bg-orange-500 text-white font-bold rounded-lg shadow-sm transition-colors uppercase text-xs disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Cadastrar Máquina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
