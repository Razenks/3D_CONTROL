import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalEditarOrcamento({ isOpen, onClose, orcamento, onSucesso }) {
    const [materiais, setMateriais] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itens, setItens] = useState([]);
    const [materiaisNoItem, setMateriaisNoItem] = useState([]);

    const [formData, setFormData] = useState({
        cliente_id: '',
        projeto: '',
        item_nome: '',
        item_tamanho: '',
        material_id: '',
        peso: '',
        horas: '',
        minutos: '',
        falha_risco: '10',
        lucro_desejado: '100',
        quantidade: '1',
        consumo_watts: '350',
        kwh_preco: '0.75',
        valor_impressora: '3000',
        vida_util_horas: '10000'
    });

    const [totais, setTotais] = useState({
        custo_total: 0,
        preco_venda: 0,
        lucro_liquido: 0
    });

    const [precoEditado, setPrecoEditado] = useState('');
    const [editandoPreco, setEditandoPreco] = useState(false);

    // Novo estado para o preço do item atual que está sendo preenchido
    const [itemPrecoManual, setItemPrecoManual] = useState('');
    const [itemCustoCalculado, setItemCustoCalculado] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchDados();
            if (orcamento) {
                setFormData(prev => ({
                    ...prev,
                    cliente_id: orcamento.cliente_id || '',
                    projeto: orcamento.projeto || ''
                }));
                setItens(orcamento.itens || []);
                calcularTotais(orcamento.itens || []);
            }
        }
    }, [isOpen, orcamento]);

    // Efeito para calcular o preço sugerido em tempo real
    useEffect(() => {
        if (formData.item_nome && materiaisNoItem.length > 0) {
            const custoMaterialTotal = materiaisNoItem.reduce((acc, m) => acc + m.custo, 0);
            const tempoTotalH = parseFloat(formData.horas || 0) + (parseFloat(formData.minutos || 0) / 60);
            const custoEnergia = (parseFloat(formData.consumo_watts) / 1000) * tempoTotalH * parseFloat(formData.kwh_preco);
            const custoDepreciacao = (parseFloat(formData.valor_impressora) / parseFloat(formData.vida_util_horas)) * tempoTotalH;
            const custoBase = custoMaterialTotal + custoEnergia + custoDepreciacao;
            const risco = custoBase * (parseFloat(formData.falha_risco) / 100);
            const custoTotalUnidade = custoBase + risco;
            const margem = 1 + (parseFloat(formData.lucro_desejado) / 100);
            const precoVendaUnidade = custoTotalUnidade * margem;
            const quantidade = parseInt(formData.quantidade || 1);
            
            const custoTotal = custoTotalUnidade * quantidade;
            const precoSugerido = arredondar(precoVendaUnidade * quantidade);
            
            setItemCustoCalculado(custoTotal);
            setItemPrecoManual(precoSugerido.toString());
        } else {
            setItemPrecoManual('');
            setItemCustoCalculado(0);
        }
    }, [formData, materiaisNoItem]);

    const fetchDados = async () => {
        const token = localStorage.getItem('auth_token');
        try {
            const [resCli, resMat] = await Promise.all([
                fetch(`${API_BASE_URL}/api/clientes?ativos_only=1`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/api/materiais?ativos_only=1`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (resCli.ok) setClientes(await resCli.json());
            if (resMat.ok) setMateriais(await resMat.json());
        } catch (err) { console.error(err); }
    };

    const arredondar = (valor) => Math.ceil(valor);

    const adicionarMaterialAoItem = () => {
        const mat = materiais.find(m => m.id === parseInt(formData.material_id));
        if (!mat || !formData.peso) {
            alert('Selecione o material e informe o peso.');
            return;
        }
        const peso = parseFloat(formData.peso);
        const custo = (parseFloat(mat.custo_unidade) / 1000) * peso;
        setMateriaisNoItem([...materiaisNoItem, {
            id: mat.id,
            tipo: mat.tipo,
            cor: mat.cor?.nome,
            peso: peso,
            custo: custo
        }]);
        setFormData({ ...formData, peso: '' });
    };

    const removerMaterialDoItem = (index) => {
        setMateriaisNoItem(materiaisNoItem.filter((_, i) => i !== index));
    };

    const adicionarItem = () => {
        if (materiaisNoItem.length === 0 || !formData.item_nome) {
            alert('Preencha o nome do item e adicione pelo menos um material.');
            return;
        }

        const quantidade = parseInt(formData.quantidade);
        const precoFinal = parseFloat(itemPrecoManual) || 0;
        const custoFinal = parseFloat(itemCustoCalculado.toFixed(2)) || 0;

        const item = {
            id: Date.now(),
            nome: formData.item_nome,
            tamanho: formData.item_tamanho,
            materiais: materiaisNoItem,
            peso_total: materiaisNoItem.reduce((acc, m) => acc + m.peso, 0),
            quantidade: quantidade,
            custo: custoFinal,
            preco: precoFinal,
            detalhes: { ...formData, materiais: materiaisNoItem }
        };

        const novosItens = [...itens, item];
        setItens(novosItens);
        calcularTotais(novosItens);
        
        // Reset form
        setMateriaisNoItem([]);
        setFormData({ ...formData, item_nome: '', item_tamanho: '', peso: '', horas: '', minutos: '', quantidade: '1' });
        setItemPrecoManual('');
        setItemCustoCalculado(0);
    };

    const handleItemPrecoChange = (id, novoPreco) => {
        const novosItens = itens.map(item => {
            if (item.id === id) {
                return { ...item, preco: parseFloat(novoPreco) || 0 };
            }
            return item;
        });
        setItens(novosItens);
        calcularTotais(novosItens);
    };

    const removerItem = (id) => {
        const novosItens = itens.filter(i => i.id !== id);
        setItens(novosItens);
        calcularTotais(novosItens);
    };

    const calcularTotais = (listaItens) => {
        const custo = listaItens.reduce((acc, i) => acc + i.custo, 0);
        const preco = listaItens.reduce((acc, i) => acc + i.preco, 0);
        setTotais({
            custo_total: custo.toFixed(2),
            preco_venda: preco.toFixed(2),
            lucro_liquido: (preco - custo).toFixed(2)
        });
        setPrecoEditado(preco.toFixed(2));
    };

    const handlePrecoChange = (valor) => {
        setPrecoEditado(valor);
        const novoPreco = parseFloat(valor);
        if (!isNaN(novoPreco)) {
            const custoTotal = parseFloat(totais.custo_total);
            setTotais(prev => ({
                ...prev,
                preco_venda: novoPreco.toFixed(2),
                lucro_liquido: (novoPreco - custoTotal).toFixed(2)
            }));
        }
    };

    const handleUpdateOrcamento = async () => {
        if (!formData.projeto || itens.length === 0) {
            alert('Preencha o nome do pedido e adicione pelo menos um item.');
            return;
        }
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/orcamentos/${orcamento.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    cliente_id: formData.cliente_id,
                    projeto: formData.projeto,
                    itens: itens,
                    valor_total: totais.preco_venda,
                    custo_estimado: totais.custo_total,
                    lucro_estimado: totais.lucro_liquido,
                })
            });

            if (response.ok) {
                alert('Orçamento atualizado com sucesso!');
                onSucesso();
                onClose();
            }
        } catch (err) { alert('Erro ao atualizar orçamento'); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-xs text-[#2A3240] dark:text-gray-200 focus:border-[#FF9B54] transition-all";
    const labelClass = "block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border dark:border-gray-800">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/20">
                    <h3 className="text-lg font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Editar Orçamento ORC-{orcamento?.id}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 transition-colors duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Dados do Pedido */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border dark:border-gray-800">
                                <div>
                                    <label className={labelClass}>Cliente</label>
                                    <select value={formData.cliente_id} onChange={e => setFormData({...formData, cliente_id: e.target.value})} className={inputClass}>
                                        <option value="">Selecione o cliente...</option>
                                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Nome do Pedido</label>
                                    <input type="text" value={formData.projeto} onChange={e => setFormData({...formData, projeto: e.target.value})} className={inputClass} />
                                </div>
                            </div>

                            {/* Formulário de Item */}
                            <div className="border border-gray-100 dark:border-gray-800 p-5 rounded-xl space-y-4 bg-white dark:bg-gray-800/10">
                                <p className="text-[10px] font-black text-[#FF9B54] uppercase tracking-widest">Adicionar/Editar Peça</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className={labelClass}>Nome da Peça</label><input type="text" value={formData.item_nome} onChange={e => setFormData({...formData, item_nome: e.target.value})} className={inputClass} /></div>
                                    <div><label className={labelClass}>Tamanho/Escala</label><input type="text" value={formData.item_tamanho} onChange={e => setFormData({...formData, item_tamanho: e.target.value})} className={inputClass} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Material</label>
                                        <select value={formData.material_id} onChange={e => setFormData({...formData, material_id: e.target.value})} className={inputClass}>
                                            <option value="">Selecione...</option>
                                            {materiais.map(m => <option key={m.id} value={m.id}>{m.tipo} - {m.cor?.nome}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Peso (g)</label>
                                        <div className="flex gap-2">
                                            <input type="number" value={formData.peso} onChange={e => setFormData({...formData, peso: e.target.value})} className={inputClass} />
                                            <button onClick={adicionarMaterialAoItem} className="bg-[#2A3240] dark:bg-orange-500 text-white px-3 rounded-lg font-black">+</button>
                                        </div>
                                    </div>
                                </div>

                                {materiaisNoItem.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-100 dark:border-gray-800 space-y-2">
                                        {materiaisNoItem.map((m, idx) => (
                                            <div key={idx} className="flex justify-between text-[10px] font-bold dark:text-gray-300">
                                                <span>{m.tipo} - {m.cor}</span>
                                                <div className="flex gap-2"><span>{m.peso}g</span><button onClick={() => removerMaterialDoItem(idx)} className="text-red-500">×</button></div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-3">
                                    <div><label className={labelClass}>Qtd</label><input type="number" value={formData.quantidade} onChange={e => setFormData({...formData, quantidade: e.target.value})} className={inputClass} /></div>
                                    <div><label className={labelClass}>Horas</label><input type="number" value={formData.horas} onChange={e => setFormData({...formData, horas: e.target.value})} className={inputClass} /></div>
                                    <div><label className={labelClass}>Min</label><input type="number" value={formData.minutos} onChange={e => setFormData({...formData, minutos: e.target.value})} className={inputClass} /></div>
                                </div>

                                <div className="bg-[#FF9B54]/10 dark:bg-orange-500/5 p-3 rounded-lg border border-[#FF9B54]/20 dark:border-orange-500/20">
                                    <label className="block text-[9px] font-black text-[#FF9B54] uppercase tracking-widest mb-1">Preço Sugerido / Editável (Total do Item)</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-[#FF9B54]">R$</span>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={itemPrecoManual} 
                                            onChange={e => setItemPrecoManual(e.target.value)} 
                                            className="w-full bg-white dark:bg-gray-800 px-3 py-1 border border-[#FF9B54]/30 rounded text-sm font-black text-[#2A3240] dark:text-gray-200 outline-none"
                                        />
                                    </div>
                                </div>

                                <button onClick={adicionarItem} className="w-full bg-[#FF9B54] text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">Incluir Peça</button>
                            </div>

                            {/* Lista de Itens */}
                            <div className="bg-[#2A3240] dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-inner">
                                <table className="w-full text-left text-white text-[10px]">
                                    <thead className="bg-black/20 uppercase font-black tracking-widest">
                                        <tr><th className="px-4 py-2">Item</th><th className="px-4 py-2 text-right">Preço</th><th className="px-4 py-2"></th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {itens.map(item => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-2"><b>{item.nome}</b> ({item.tamanho})</td>
                                                <td className="px-4 py-2 text-right font-black text-[#FF9B54]">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span className="text-[8px] text-gray-400">R$</span>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            value={item.preco} 
                                                            onChange={(e) => handleItemPrecoChange(item.id, e.target.value)}
                                                            className="w-20 bg-black/30 border border-gray-700 rounded px-2 py-1 text-right outline-none focus:border-[#FF9B54] text-xs"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right"><button onClick={() => removerItem(item.id)} className="text-gray-500 hover:text-red-500">×</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totais */}
                        <div className="space-y-6">
                            <div className="bg-[#2A3240] dark:bg-gray-800/80 p-8 rounded-2xl text-white shadow-xl">
                                <h4 className="text-[10px] font-black text-[#FF9B54] uppercase mb-6 tracking-widest">Resumo Financeiro</h4>
                                <div className="space-y-5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">Custo Total</span>
                                        <span>R$ {totais.custo_total}</span>
                                    </div>
                                    <div className="pt-5 border-t border-gray-700">
                                        <span className={labelClass}>Valor de Venda (Final)</span>
                                        {editandoPreco ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xl font-black">R$</span>
                                                <input type="number" step="0.01" value={precoEditado} onChange={e => handlePrecoChange(e.target.value)} onBlur={() => setEditandoPreco(false)} className="w-full bg-white/10 text-xl font-black rounded p-2 outline-none border border-[#FF9B54]" autoFocus />
                                            </div>
                                        ) : (
                                            <p className="text-4xl font-black cursor-pointer text-[#FF9B54] mt-1" onClick={() => setEditandoPreco(true)}>R$ {totais.preco_venda}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xs font-black pt-2">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Lucro</span>
                                        <span className={parseFloat(totais.lucro_liquido) >= 0 ? 'text-green-400' : 'text-red-400'}>R$ {totais.lucro_liquido}</span>
                                    </div>
                                </div>
                                <button disabled={loading} onClick={handleUpdateOrcamento} className="w-full mt-10 bg-[#FF9B54] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-500 transition-all">
                                    {loading ? 'Salvando...' : 'Atualizar Orçamento'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
