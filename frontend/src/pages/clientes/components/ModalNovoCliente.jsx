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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-gray-800 border-t-4 border-t-[#FF9B54] dark:border-t-[#FF9B54] animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/20 transition-colors">
          <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Cadastrar Novo Cliente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 transition-colors">
          <div className="flex gap-6 mb-2">
            <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="tipo" value="CPF" checked={formData.tipo === 'CPF'} onChange={e => setFormData({...formData, tipo: e.target.value})} className="text-[#FF9B54] focus:ring-[#FF9B54] dark:bg-gray-800 dark:border-gray-700" />
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-[#FF9B54] transition-colors">Pessoa Física</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="tipo" value="CNPJ" checked={formData.tipo === 'CNPJ'} onChange={e => setFormData({...formData, tipo: e.target.value})} className="text-[#FF9B54] focus:ring-[#FF9B54] dark:bg-gray-800 dark:border-gray-700" />
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-[#FF9B54] transition-colors">Pessoa Jurídica</span>
            </label>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-1.5">Nome Completo / Razão Social</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              placeholder="Ex: João Silva"
            />
          </div>

          {formData.tipo === 'CPF' ? (
            <div className="animate-in slide-in-from-top duration-300">
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-1.5">CPF</label>
                <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="000.000.000-00"
                />
            </div>
          ) : (
            <div className="animate-in slide-in-from-top duration-300">
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-1.5">CNPJ</label>
                <input
                type="text"
                required
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="00.000.000/0000-00"
                />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-1.5">WhatsApp</label>
              <input
                type="text"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-1.5">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-red-500 transition-colors order-2 sm:order-1">Cancelar</button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white font-black rounded-xl transition-all shadow-xl shadow-orange-500/10 uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
