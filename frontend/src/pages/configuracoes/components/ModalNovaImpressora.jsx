import React, { useState } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalNovaImpressora({ isOpen, onClose, onSucesso }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    modelo: '',
    ip_local: '',
    tipo_conexao: 'klipper' // Klipper (K1) como padrão
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/impressoras`, {
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
        setFormData({ nome: '', modelo: '', ip_local: '', tipo_conexao: 'klipper' });
      } else {
        alert('Erro ao cadastrar impressora.');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-gray-800 border-t-4 border-t-[#2A3240] dark:border-t-orange-500 animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/20 transition-colors">
          <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Cadastrar Nova Máquina</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 transition-colors">
          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nome de Identificação</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              placeholder="Ex: Creality K1 Casa"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Modelo da Impressora</label>
            <input
              type="text"
              required
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              placeholder="Ex: Creality K1"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">IP Local / Endereço</label>
            <input
              type="text"
              value={formData.ip_local}
              onChange={(e) => setFormData({ ...formData, ip_local: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              placeholder="Ex: 192.168.1.102"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 italic font-bold uppercase tracking-tighter">* Necessário para monitoramento em tempo real.</p>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tipo de Conexão</label>
            <select
              value={formData.tipo_conexao}
              onChange={(e) => setFormData({ ...formData, tipo_conexao: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-black text-[#2A3240] dark:text-gray-200 text-xs transition-all"
            >
              <option value="manual">Manual (Sem conexão)</option>
              <option value="klipper">Klipper / Moonraker (K1, K1 Max, K1C)</option>
              <option value="octoprint">OctoPrint</option>
            </select>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-red-500 transition-all order-2 sm:order-1">Cancelar</button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white font-black rounded-xl transition-all shadow-xl shadow-orange-500/10 uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Cadastrar Máquina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
