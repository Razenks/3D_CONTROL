import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalEditarCliente({ isOpen, onClose, cliente, onSucesso }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'CPF',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    endereco_entrega: ''
  });

  // Carrega os dados sempre que o cliente mudar ou o modal abrir
  useEffect(() => {
    if (cliente && isOpen) {
      setFormData({
        nome: cliente.nome || '',
        tipo: cliente.tipo || 'CPF',
        cpf: cliente.cpf || '',
        cnpj: cliente.cnpj || '',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        endereco: cliente.endereco || '',
        endereco_entrega: cliente.endereco_entrega || ''
      });
    }
  }, [cliente, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    // Limpar o campo oposto ao tipo selecionado antes de enviar
    const dataToSend = { ...formData };
    if (formData.tipo === 'CPF') dataToSend.cnpj = '';
    else dataToSend.cpf = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        onSucesso();
        onClose();
      } else {
        const err = await response.json();
        alert(err.message || 'Erro ao atualizar cliente.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto border dark:border-gray-800 border-t-8 border-t-blue-500 transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/20 transition-colors">
          <h3 className="text-xl font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Editar Cliente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tipo de Pessoa</label>
              <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setFormData({...formData, tipo: 'CPF'})}
                    className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${formData.tipo === 'CPF' ? 'bg-[#2A3240] dark:bg-blue-600 text-white border-[#2A3240] dark:border-blue-600' : 'bg-white dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-700 hover:border-blue-500/30'}`}
                >Pessoa Física</button>
                <button
                    type="button"
                    onClick={() => setFormData({...formData, tipo: 'CNPJ'})}
                    className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${formData.tipo === 'CNPJ' ? 'bg-[#2A3240] dark:bg-blue-600 text-white border-[#2A3240] dark:border-blue-600' : 'bg-white dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-700 hover:border-blue-500/30'}`}
                >Pessoa Jurídica</button>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nome Completo / Razão Social</label>
              <input
                required
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">{formData.tipo === 'CPF' ? 'CPF' : 'CNPJ'}</label>
              {formData.tipo === 'CPF' ? (
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                  />
              ) : (
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                  />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Telefone / WhatsApp</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Endereço Principal</label>
              <textarea
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Endereço de Entrega</label>
              <textarea
                value={formData.endereco_entrega}
                onChange={(e) => setFormData({...formData, endereco_entrega: e.target.value})}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 flex gap-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-[10px] tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-blue-600 dark:bg-blue-500 text-white font-black rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 uppercase text-[10px] tracking-widest disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Atualizar Dados'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
