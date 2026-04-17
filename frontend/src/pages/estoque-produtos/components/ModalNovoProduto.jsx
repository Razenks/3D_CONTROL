import React, { useState } from 'react';

export default function ModalNovoProduto({ isOpen, onClose, onSalvar }) {
  const [formData, setFormData] = useState({
    nome: '',
    tempo_horas: '',
    data_fabricacao: '',
    custo_material: '',
    margem_lucro: '',
    quantidade: 1
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(formData);
    // Limpa o formulário após salvar
    setFormData({ nome: '', tempo_horas: '', data_fabricacao: '', custo_material: '', margem_lucro: '', quantidade: 1 });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-gray-800 border-t-4 border-t-[#FF9B54] dark:border-t-[#FF9B54] animate-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/20 transition-colors">
          <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Cadastrar Novo Produto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 transition-colors">
          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nome do Produto</label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
              placeholder="Ex: Suporte de Controle PS5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tempo (Horas)</label>
              <input
                type="number"
                name="tempo_horas"
                required
                min="0"
                step="0.5"
                value={formData.tempo_horas}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="Ex: 4.5"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Data de Fabricação</label>
              <input
                type="date"
                name="data_fabricacao"
                required
                value={formData.data_fabricacao}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-black text-[#2A3240] dark:text-gray-200 text-xs transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                required
                min="1"
                value={formData.quantidade}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="Ex: 1"
              />
            </div>
             <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Margem de Lucro (%)</label>
              <input
                type="number"
                name="margem_lucro"
                required
                min="0"
                value={formData.margem_lucro}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all"
                placeholder="Ex: 300"
              />
            </div>
          </div>

          <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Custo Material (R$)</label>
              <input
                type="number"
                name="custo_material"
                required
                min="0"
                step="0.01"
                value={formData.custo_material}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-black text-[#2A3240] dark:text-[#FF9B54] text-lg transition-all"
                placeholder="Ex: 12.50"
              />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-red-500 transition-all order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-4 text-xs font-black text-white bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 rounded-xl transition-all shadow-xl shadow-orange-500/10 uppercase tracking-widest order-1 sm:order-2"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}