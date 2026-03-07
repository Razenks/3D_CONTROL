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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#FF9B54]">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#2A3240]">Cadastrar Novo Produto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#2A3240] mb-1">Nome do Produto</label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A3240]"
              placeholder="Ex: Suporte de Controle PS5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Tempo (Horas)</label>
              <input
                type="number"
                name="tempo_horas"
                required
                min="0"
                step="0.5"
                value={formData.tempo_horas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A3240]"
                placeholder="Ex: 4.5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Data de Fabricação</label>
              <input
                type="date"
                name="data_fabricacao"
                required
                value={formData.data_fabricacao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A3240]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                required
                min="1"
                value={formData.quantidade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A3240]"
                placeholder="Ex: 1"
              />
            </div>
             <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Margem de Lucro (%)</label>
              <input
                type="number"
                name="margem_lucro"
                required
                min="0"
                value={formData.margem_lucro}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A3240]"
                placeholder="Ex: 300"
              />
            </div>
          </div>

          <div className="pt-2">
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Custo Material (R$)</label>
              <input
                type="number"
                name="custo_material"
                required
                min="0"
                step="0.01"
                value={formData.custo_material}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A3240]"
                placeholder="Ex: 12.50"
              />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-[#FF9B54] hover:bg-orange-500 rounded-lg transition-colors shadow-sm"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}