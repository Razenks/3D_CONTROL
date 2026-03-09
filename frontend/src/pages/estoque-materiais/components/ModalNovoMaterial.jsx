import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalNovoMaterial({ isOpen, onClose, onSalvar }) {
  const [formData, setFormData] = useState({
    tipo: 'PLA',
    marca_id: '',
    cor_id: '',
    cor_codigo: '', 
    cor_nome_exibicao: '', 
    hexCor: '#000000',
    custoKG: '',
    quantidadeInicial: '1000',
    unidade: 'g'
  });

  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchExtras();
    }
  }, [isOpen]);

  const fetchExtras = async () => {
    setLoadingExtras(true);
    const token = localStorage.getItem('auth_token');
    try {
      const [resM, resC] = await Promise.all([
        fetch(`${API_BASE_URL}/api/marcas`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/cores`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (resM.ok) setMarcas(await resM.json());
      if (resC.ok) setCores(await resC.json());
    } catch (err) {
      console.error('Erro ao carregar extras:', err);
    } finally {
      setLoadingExtras(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cor_codigo') {
        const corEncontrada = cores.find(c => c.codigo === value);
        setFormData(prev => ({ 
            ...prev, 
            cor_codigo: value,
            cor_id: corEncontrada ? corEncontrada.id : '',
            cor_nome_exibicao: corEncontrada ? corEncontrada.nome : 'Não encontrada',
            hexCor: corEncontrada ? (corEncontrada.hex || prev.hexCor) : prev.hexCor
        }));
        return;
    }
    if (name === 'cor_id') {
        const corEncontrada = cores.find(c => c.id === parseInt(value));
        setFormData(prev => ({
            ...prev,
            cor_id: value,
            cor_codigo: corEncontrada ? corEncontrada.codigo : '',
            cor_nome_exibicao: corEncontrada ? corEncontrada.nome : '',
            hexCor: corEncontrada ? (corEncontrada.hex || prev.hexCor) : prev.hexCor
        }));
        return;
    }
    if (name === 'tipo' && (value === 'Resina Standard' || value === 'Resina ABS-Like')) {
        setFormData(prev => ({ ...prev, [name]: value, unidade: 'ml' }));
    } else if (name === 'tipo') {
        setFormData(prev => ({ ...prev, [name]: value, unidade: 'g' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMarca = async () => {
    const nome = prompt('Digite o nome da nova Marca:');
    if (!nome) return;
    const token = localStorage.getItem('auth_token');
    try {
        const res = await fetch(`${API_BASE_URL}/api/marcas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ nome })
        });
        if (res.ok) fetchExtras();
    } catch (err) { alert('Erro ao adicionar marca'); }
  };

  const handleAddCor = async () => {
    const codigo = prompt('Digite o número/código da cor:');
    const nome = prompt('Digite o nome da cor:');
    if (!codigo || !nome) return;
    const token = localStorage.getItem('auth_token');
    try {
        const res = await fetch(`${API_BASE_URL}/api/cores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ codigo, nome })
        });
        if (res.ok) fetchExtras();
    } catch (err) { alert('Erro ao adicionar cor'); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.marca_id || !formData.cor_id) {
        alert('Por favor, selecione uma marca e uma cor válida.');
        return;
    }
    onSalvar({
        tipo: formData.tipo,
        marca_id: formData.marca_id,
        cor_id: formData.cor_id,
        custo_unidade: formData.custoKG,
        quantidade_restante: formData.quantidadeInicial,
        unidade: formData.unidade
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border-t-4 border-[#FF9B54] my-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#2A3240]">Cadastrar Novo Insumo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none text-sm font-bold">
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
                <option value="Resina Standard">Resina Standard</option>
                <option value="Resina ABS-Like">Resina ABS-Like</option>
                <option value="TPU">TPU (Flexível)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Marca</label>
              <div className="flex gap-2">
                <select name="marca_id" required value={formData.marca_id} onChange={handleChange} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none text-sm font-bold">
                    <option value="">Selecione...</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
                <button type="button" onClick={handleAddMarca} className="bg-gray-100 px-3 rounded-lg hover:bg-gray-200 text-[#2A3240] font-black">+</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Código Cor</label>
              <input type="text" name="cor_codigo" value={formData.cor_codigo} onChange={handleChange} placeholder="Ex: 1" className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Selecionar Cor</label>
              <div className="flex gap-2">
                <select name="cor_id" required value={formData.cor_id} onChange={handleChange} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none text-sm font-bold">
                    <option value="">Selecione...</option>
                    {cores.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nome}</option>)}
                </select>
                <button type="button" onClick={handleAddCor} className="bg-gray-100 px-3 rounded-lg hover:bg-gray-200 text-[#2A3240] font-black">+</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Custo (R$ /KG)</label>
              <input type="number" name="custoKG" required step="0.01" value={formData.custoKG} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Qtd. Inicial ({formData.unidade})</label>
              <input type="number" name="quantidadeInicial" required value={formData.quantidadeInicial} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none font-bold text-sm" />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest order-2 sm:order-1">Cancelar</button>
            <button type="submit" className="px-8 py-4 text-xs font-black text-white bg-[#2A3240] hover:bg-gray-800 rounded-xl transition-all shadow-lg uppercase tracking-widest order-1 sm:order-2">Confirmar Cadastro</button>
          </div>
        </form>
      </div>
    </div>
  );
}
