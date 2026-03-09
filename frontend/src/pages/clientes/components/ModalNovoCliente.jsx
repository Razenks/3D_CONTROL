import React, { useState } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalNovoCliente({ isOpen, onClose, onSucesso }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    tipo: 'CPF', // Valor padrão esperado pelo backend
    cnpj: '',
    cpf: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSucesso();
        onClose();
        setFormData({ nome: '', telefone: '', email: '', tipo: 'CPF', cnpj: '', cpf: '' });
      } else {
        const errorData = await response.json();
        alert('Erro ao cadastrar: ' + (errorData.message || 'Verifique se os dados estão corretos.'));
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#FF9B54] animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#2A3240]">Cadastrar Novo Cliente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo" value="CPF" checked={formData.tipo === 'CPF'} onChange={e => setFormData({...formData, tipo: e.target.value})} className="text-[#FF9B54] focus:ring-[#FF9B54]" />
                <span className="text-sm font-bold text-gray-600 uppercase">Pessoa Física</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo" value="CNPJ" checked={formData.tipo === 'CNPJ'} onChange={e => setFormData({...formData, tipo: e.target.value})} className="text-[#FF9B54] focus:ring-[#FF9B54]" />
                <span className="text-sm font-bold text-gray-600 uppercase">Pessoa Jurídica</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Nome Completo / Razão Social</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
              placeholder="Ex: João Silva"
            />
          </div>

          {formData.tipo === 'CPF' ? (
            <div className="animate-in slide-in-from-top duration-300">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">CPF</label>
                <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
                placeholder="000.000.000-00"
                />
            </div>
          ) : (
            <div className="animate-in slide-in-from-top duration-300">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">CNPJ</label>
                <input
                type="text"
                required
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
                placeholder="00.000.000/0000-00"
                />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp</label>
              <input
                type="text"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]"
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-red-500 transition-colors order-2 sm:order-1">Cancelar</button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#2A3240] hover:bg-gray-800 text-white font-black rounded-xl transition-all shadow-xl uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
