import React, { useState } from 'react';

export default function ModalNovoMaterial({ isOpen, onClose, onSalvar }) {
  const [formData, setFormData] = useState({
    tipo: 'PLA',
    marca: '',
    cor: '',
    hexCor: '#000000',
    custoKG: '',
    quantidadeInicial: '1000',
    unidade: 'g'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Se mudar para Resina, altera unidade para ml automaticamente
    if (name === 'tipo' && (value === 'Resina Standard' || value === 'Resina ABS-Like')) {
        setFormData(prev => ({ ...prev, [name]: value, unidade: 'ml' }));
    } else if (name === 'tipo') {
        setFormData(prev => ({ ...prev, [name]: value, unidade: 'g' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border-t-4 border-[#FF9B54]">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#2A3240]">Cadastrar Novo Insumo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Tipo de Material</label>
              <select 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] outline-none"
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
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Marca</label>
              <input
                type="text"
                name="marca"
                required
                value={formData.marca}
                onChange={handleChange}
                placeholder="Ex: Sunlu, Voolt3D"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Cor (Nome)</label>
              <input
                type="text"
                name="cor"
                required
                value={formData.cor}
                onChange={handleChange}
                placeholder="Ex: Space Grey"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Cor Visual</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="hexCor"
                  value={formData.hexCor}
                  onChange={handleChange}
                  className="w-12 h-10 border-none rounded cursor-pointer"
                />
                <span className="text-xs text-gray-500 uppercase font-mono">{formData.hexCor}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Custo (R$ por KG/L)</label>
              <input
                type="number"
                name="custoKG"
                required
                step="0.01"
                value={formData.custoKG}
                onChange={handleChange}
                placeholder="Ex: 120.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2A3240] mb-1">Peso/Vol Inicial ({formData.unidade})</label>
              <input
                type="number"
                name="quantidadeInicial"
                required
                value={formData.quantidadeInicial}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-bold text-white bg-[#FF9B54] hover:bg-orange-500 rounded-lg transition-colors shadow-sm"
            >
              Adicionar ao Estoque
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}