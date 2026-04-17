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
    preco_venda: '',
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
      const det = orc.detalhes_calculo || {};
      const q = parseInt(det.quantidade || 1);
      const precoUn = q > 0 ? (parseFloat(orc.valor_total) / q) : 0;

      setFormData({
        ...formData,
        orcamento_id: id,
        projeto_nome: orc.projeto,
        preco_venda: precoUn.toFixed(2),
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
            preco_venda: prod.preco_venda || '',
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
        setFormData({ orcamento_id: '', material_id: '', impressora_id: '', peso_estimado: '', tempo_estimado: '', projeto_nome: '', preco_venda: '', cliente_id: '', quantidade: 1 });
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-auto border dark:border-gray-800 animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-[#2A3240] text-white">
          <h3 className="text-xl font-black uppercase tracking-tighter">Iniciar Nova Impressão</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 transition-colors">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Puxar do Catálogo</label>
                <select onChange={handleCatalogoChange} className="w-full px-3 py-3 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 text-[#2A3240] dark:text-blue-400 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-blue-500/20 transition-all">
                <option value="">-- Selecionar Modelo --</option>
                {catalogo.map(p => (<option key={p.id} value={p.id} className="dark:bg-[#1a1f2e]">{p.nome}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Vincular Orçamento</label>
                <select value={formData.orcamento_id} onChange={handleOrcamentoChange} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[#2A3240] dark:text-gray-200 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-[#FF9B54]/20 transition-all">
                <option value="">-- Avulso --</option>
                {orcamentos.map(o => (<option key={o.id} value={o.id} className="dark:bg-[#1a1f2e]">{o.projeto}</option>))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Nome do Projeto / Peça</label>
            <input type="text" required placeholder="Ex: Suporte Articulado" value={formData.projeto_nome} onChange={(e) => setFormData({...formData, projeto_nome: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all" />
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Preço de Venda Unitário (R$)</label>
            <input type="number" step="0.01" placeholder="Ex: 45.00" value={formData.preco_venda} onChange={(e) => setFormData({...formData, preco_venda: e.target.value})} className="w-full px-4 py-3 bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 font-black text-green-700 dark:text-green-400 rounded-xl outline-none text-lg transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Cliente</label>
                <select value={formData.cliente_id} onChange={(e) => setFormData({...formData, cliente_id: e.target.value})} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[#2A3240] dark:text-gray-200 rounded-xl outline-none font-bold text-xs transition-all">
                <option value="">Selecione o cliente</option>
                {clientes.map(c => (<option key={c.id} value={c.id} className="dark:bg-[#1a1f2e]">{c.nome}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Quantidade</label>
                <input type="number" required min="1" value={formData.quantidade} onChange={(e) => setFormData({...formData, quantidade: e.target.value})} className="w-full px-4 py-3 bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-[#FF9B54] font-black rounded-xl outline-none text-sm transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Impressora</label>
                <select required value={formData.impressora_id} onChange={(e) => setFormData({...formData, impressora_id: e.target.value})} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[#2A3240] dark:text-gray-200 rounded-xl outline-none font-bold text-xs transition-all">
                <option value="">Selecione</option>
                {impressoras.map(i => (<option key={i.id} value={i.id} className="dark:bg-[#1a1f2e]">{i.nome}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Filamento</label>
                <select required value={formData.material_id} onChange={(e) => setFormData({...formData, material_id: e.target.value})} className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[#2A3240] dark:text-gray-200 rounded-xl outline-none font-bold text-xs transition-all">
                <option value="">Selecione o material</option>
                {materiais.map(m => (<option key={m.id} value={m.id} disabled={m.quantidade_restante <= 0} className="dark:bg-[#1a1f2e]">{m.marca?.nome} {m.tipo} - {m.cor?.nome} ({m.quantidade_restante}{m.unidade})</option>))}
                </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Peso Unidade (g)</label>
              <input type="number" required min="0.1" step="0.1" value={formData.peso_estimado} onChange={(e) => setFormData({...formData, peso_estimado: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Tempo Unidade</label>
              <input type="text" placeholder="Ex: 1h 30m" value={formData.tempo_estimado} onChange={(e) => setFormData({...formData, tempo_estimado: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#FF9B54] outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Arquivo G-code (Para Automação)</label>
            <select value={formData.gcode_filename} onChange={(e) => setFormData({...formData, gcode_filename: e.target.value})} className="w-full px-3 py-3 bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-[#FF9B54] rounded-xl outline-none font-bold text-xs transition-all">
              <option value="">-- Selecionar arquivo da impressora --</option>
              {arquivosImpressora.map((f, idx) => (<option key={idx} value={f.name} className="dark:bg-[#1a1f2e]">{f.name}</option>))}
            </select>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
            <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-red-500 transition-all order-2 sm:order-1">Cancelar</button>
            <button type="submit" disabled={loading} className="px-8 py-4 text-xs font-black text-white bg-[#FF9B54] dark:bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-xl shadow-orange-500/10 uppercase tracking-widest order-1 sm:order-2">
              {loading ? 'Processando...' : 'Adicionar à Fila'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
