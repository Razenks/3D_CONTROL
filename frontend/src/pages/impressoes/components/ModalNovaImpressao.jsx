import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalNovaImpressao({ isOpen, onClose, onSucesso }) {
  const [orcamentos, setOrcamentos] = useState([]);
  const [impressoras, setImpressoras] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orcamento_id: '',
    material_id: '',
    impressora_id: '',
    cliente_id: '',
    peso_estimado: '',
    tempo_estimado: '',
    projeto_nome: '',
    gcode_filename: '',
    quantidade: 1
  });

  useEffect(() => {
    if (isOpen) {
      fetchDados();
    }
  }, [isOpen]);

  const [arquivosImpressora, setArquivosImpressora] = useState([]);
  useEffect(() => {
    if (formData.impressora_id) {
        fetchArquivos(formData.impressora_id);
    }
  }, [formData.impressora_id]);

  const fetchArquivos = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        const res = await fetch(`${API_BASE_URL}/api/impressoras/${id}/files`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setArquivosImpressora(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchDados = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const [resOrc, resImp, resMat, resCat, resCli] = await Promise.all([
        fetch(`${API_BASE_URL}/api/impressoes/available-orcamentos`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/impressoras`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/materiais?ativos_only=1`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/produtos-catalogo`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/clientes`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (resOrc.ok) setOrcamentos(await resOrc.json());
      if (resImp.ok) setImpressoras(await resImp.json());
      if (resMat.ok) setMateriais(await resMat.json());
      if (resCat.ok) setCatalogo(await resCat.json());
      if (resCli.ok) setClientes(await resCli.json());
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  const handleOrcamentoChange = (e) => {
    const id = e.target.value;
    if (!id) {
        setFormData({ ...formData, orcamento_id: '', projeto_nome: '', peso_estimado: '', tempo_estimado: '', cliente_id: '' });
        return;
    }

    const orc = orcamentos.find(o => o.id === parseInt(id));
    if (orc) {
      setFormData({
        ...formData,
        orcamento_id: id,
        projeto_nome: orc.projeto,
        peso_estimado: orc.detalhes_calculo?.peso || '',
        tempo_estimado: `${orc.detalhes_calculo?.horas || 0}h ${orc.detalhes_calculo?.minutos || 0}m`,
        cliente_id: orc.cliente_id || '',
        quantidade: 1
      });
    }
  };

  const formatarTempo = (tempo) => {
    if (!tempo) return '0h 0m';
    if (typeof tempo !== 'string') return `${tempo}h 0m`;
    if (tempo.includes('h') || tempo.includes('m')) return tempo;
    const num = parseFloat(tempo);
    if (!isNaN(num)) {
        const h = Math.floor(num);
        const m = Math.round((num - h) * 60);
        return `${h}h ${m}m`;
    }
    return tempo;
  };

  const handleCatalogoChange = (e) => {
    const id = e.target.value;
    if (!id) return;
    const prod = catalogo.find(p => p.id === parseInt(id));
    if (prod) {
        setFormData({
            ...formData,
            projeto_nome: prod.nome,
            peso_estimado: prod.peso_padrao,
            tempo_estimado: formatarTempo(prod.tempo_padrao),
            orcamento_id: '',
            quantidade: 1
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/impressoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ...formData, status: 'fila' })
      });

      if (response.ok) {
        onSucesso();
        onClose();
        setFormData({ orcamento_id: '', material_id: '', impressora_id: '', peso_estimado: '', tempo_estimado: '', projeto_nome: '', cliente_id: '', quantidade: 1 });
      } else {
        const data = await response.json();
        alert(`ERRO: ${data.message}`);
      }
    } catch (err) {
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#2A3240] text-white">
          <h3 className="text-xl font-bold">Iniciar Nova Impressão</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Puxar do Catálogo</label>
                <select onChange={handleCatalogoChange} className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg outline-none text-sm">
                <option value="">-- Selecionar Modelo --</option>
                {catalogo.map(p => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Vincular Orçamento</label>
                <select value={formData.orcamento_id} onChange={handleOrcamentoChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-sm">
                <option value="">-- Avulso --</option>
                {orcamentos.map(o => (<option key={o.id} value={o.id}>{o.projeto}</option>))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Projeto / Peça</label>
            <input type="text" required placeholder="Ex: Suporte Articulado" value={formData.projeto_nome} onChange={(e) => setFormData({...formData, projeto_nome: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9B54] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cliente</label>
                <select value={formData.cliente_id} onChange={(e) => setFormData({...formData, cliente_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                <option value="">Selecione o cliente</option>
                {clientes.map(c => (<option key={c.id} value={c.id}>{c.nome}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Quantidade</label>
                <input type="number" required min="1" value={formData.quantidade} onChange={(e) => setFormData({...formData, quantidade: e.target.value})} className="w-full px-4 py-2 border border-orange-200 bg-orange-50 font-bold rounded-lg outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Impressora</label>
                <select required value={formData.impressora_id} onChange={(e) => setFormData({...formData, impressora_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
                <option value="">Selecione</option>
                {impressoras.map(i => (<option key={i.id} value={i.id}>{i.nome}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Filamento</label>
                <select required value={formData.material_id} onChange={(e) => setFormData({...formData, material_id: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none font-medium text-sm">
                <option value="">Selecione o material</option>
                {materiais.map(m => (<option key={m.id} value={m.id} disabled={m.quantidade_restante <= 0}>{m.marca?.nome} {m.tipo} - {m.cor?.nome} ({m.quantidade_restante}{m.unidade})</option>))}
                </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Peso Unidade (g)</label>
              <input type="number" required min="0.1" step="0.1" value={formData.peso_estimado} onChange={(e) => setFormData({...formData, peso_estimado: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tempo Unidade</label>
              <input type="text" placeholder="Ex: 1h 30m" value={formData.tempo_estimado} onChange={(e) => setFormData({...formData, tempo_estimado: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Arquivo G-code (Para Automação)</label>
            <select value={formData.gcode_filename} onChange={(e) => setFormData({...formData, gcode_filename: e.target.value})} className="w-full px-4 py-2 border border-orange-200 bg-orange-50 rounded-lg outline-none font-medium text-sm">
              <option value="">-- Selecionar arquivo da impressora --</option>
              {arquivosImpressora.map((f, idx) => (<option key={idx} value={f.name}>{f.name}</option>))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-[#FF9B54] hover:bg-orange-500 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50">
              {loading ? 'Processando...' : 'Adicionar à Fila'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
