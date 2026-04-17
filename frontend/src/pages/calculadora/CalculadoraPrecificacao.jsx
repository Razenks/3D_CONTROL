import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import API_BASE_URL from '../../config';

export default function CalculadoraPrecificacao() {
    const [materiais, setMateriais] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [calculado, setCalculado] = useState(false);
    const [itens, setItens] = useState([]);
    const [materiaisNoItem, setMateriaisNoItem] = useState([]);

    const [formData, setFormData] = useState({
        cliente_id: '',
        projeto: '', // Nome do grupo/pedido
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

    // Efeito para calcular o preço sugerido em tempo real
    useEffect(() => {
        if (formData.item_nome && materiaisNoItem.length > 0) {
            const custoMaterialTotal = materiaisNoItem.reduce((acc, m) => acc + m.custo, 0);
            const tempoTotalH = parseFloat(formData.horas || 0) + (parseFloat(formData.minutos || 0) / 60);
            
            const consumoWatts = parseFloat(formData.consumo_watts || 0);
            const kwhPreco = parseFloat(formData.kwh_preco || 0);
            const custoEnergia = (consumoWatts / 1000) * tempoTotalH * kwhPreco;

            const valorImpressora = parseFloat(formData.valor_impressora || 0);
            const vidaUtilH = parseFloat(formData.vida_util_horas || 1);
            const custoDepreciacao = (valorImpressora / vidaUtilH) * tempoTotalH;

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

    useEffect(() => {
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
        fetchDados();
    }, []);

    const arredondar = (valor) => {
        return Math.ceil(valor);
    };

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
        
        // Limpar campos e materiais do item
        setMateriaisNoItem([]);
        setFormData({
            ...formData,
            item_nome: '',
            item_tamanho: '',
            peso: '',
            horas: '',
            minutos: '',
            quantidade: '1'
        });
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
        setCalculado(listaItens.length > 0);
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

    const handleSalvarOrcamento = async () => {
        if (!formData.projeto || itens.length === 0) {
            alert('Preencha o nome do pedido e adicione pelo menos um item.');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/orcamentos`, {
                method: 'POST',
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
                    status: 'Pendente',
                    detalhes_calculo: { global: formData, itens_contagem: itens.length }
                })
            });

            if (response.ok) {
                alert('Orçamento gerado com sucesso!');
                setCalculado(false);
                setItens([]);
                setFormData({ ...formData, projeto: '', item_nome: '', item_tamanho: '', peso: '', horas: '', minutos: '' });
            }
        } catch (err) { alert('Erro ao salvar orçamento'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-bold text-[#2A3240] dark:text-gray-200 focus:border-[#FF9B54] transition-all";
    const labelClass = "block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2";

    return (
        <Layout>
            <div className="max-w-6xl mx-auto transition-colors duration-300">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Calculadora de Precificação</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Calcule custos e gere orçamentos profissionais com múltiplos itens.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário de Configuração Geral e Item */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Dados Gerais do Pedido */}
                        <div className="bg-white dark:bg-[#1a1f2e] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                            <div className="md:col-span-2">
                                <p className="text-[10px] font-black text-[#FF9B54] uppercase tracking-widest mb-4">Informações do Pedido</p>
                            </div>
                            <div>
                                <label className={labelClass}>Cliente</label>
                                <select
                                    value={formData.cliente_id}
                                    onChange={e => setFormData({...formData, cliente_id: e.target.value})}
                                    className={inputClass}
                                >
                                    <option value="">Selecione o cliente...</option>
                                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Nome do Pedido / Referência</label>
                                <input
                                    type="text"
                                    value={formData.projeto}
                                    onChange={e => setFormData({...formData, projeto: e.target.value})}
                                    className={inputClass}
                                    placeholder="Ex: Pedido João - Action Figures"
                                />
                            </div>
                        </div>

                        {/* Adicionar Item */}
                        <div className="bg-white dark:bg-[#1a1f2e] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6 transition-colors">
                            <p className="text-[10px] font-black text-[#FF9B54] uppercase tracking-widest mb-4">Adicionar Item ao Orçamento</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Nome da Peça</label>
                                    <input
                                        type="text"
                                        value={formData.item_nome}
                                        onChange={e => setFormData({...formData, item_nome: e.target.value})}
                                        className={inputClass}
                                        placeholder="Ex: Cabeça Batman"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Tamanho / Escala</label>
                                    <input
                                        type="text"
                                        value={formData.item_tamanho}
                                        onChange={e => setFormData({...formData, item_tamanho: e.target.value})}
                                        className={inputClass}
                                        placeholder="Ex: 15cm ou Escala 1/12"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Material</label>
                                    <select
                                        value={formData.material_id}
                                        onChange={e => setFormData({...formData, material_id: e.target.value})}
                                        className={inputClass}
                                    >
                                        <option value="">Selecione o filamento...</option>
                                        {materiais.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.tipo} - {m.cor?.nome || 'Sem Cor'} ({m.marca?.nome || 'S/ Marca'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Peso deste Material (g)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={formData.peso}
                                            onChange={e => setFormData({...formData, peso: e.target.value})}
                                            className={inputClass}
                                            placeholder="Ex: 15"
                                        />
                                        <button 
                                            type="button"
                                            onClick={adicionarMaterialAoItem}
                                            className="bg-[#2A3240] dark:bg-orange-500 text-white px-4 rounded-xl hover:bg-gray-800 dark:hover:bg-orange-600 transition-all font-black"
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Materiais do Item */}
                            {materiaisNoItem.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Materiais na Peça</p>
                                    {materiaisNoItem.map((m, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 px-3 rounded-lg border border-gray-100 dark:border-gray-700 text-xs shadow-sm">
                                            <span className="font-bold text-[#2A3240] dark:text-gray-200">{m.tipo} - {m.cor}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-[#FF9B54]">{m.peso}g</span>
                                                <button onClick={() => removerMaterialDoItem(idx)} className="text-red-400 hover:text-red-600 font-black">×</button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2 flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
                                        <span>Peso Total: {materiaisNoItem.reduce((s, m) => s + m.peso, 0)}g</span>
                                        <span>Custo Material: R$ {materiaisNoItem.reduce((s, m) => s + m.custo, 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label className={labelClass}>Quantidade</label>
                                    <input
                                        type="number"
                                        value={formData.quantidade}
                                        onChange={e => setFormData({...formData, quantidade: e.target.value})}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Tempo (Horas)</label>
                                        <input
                                            type="number"
                                            value={formData.horas}
                                            onChange={e => setFormData({...formData, horas: e.target.value})}
                                            className={inputClass}
                                            placeholder="Horas"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Minutos</label>
                                        <input
                                            type="number"
                                            value={formData.minutos}
                                            onChange={e => setFormData({...formData, minutos: e.target.value})}
                                            className={inputClass}
                                            placeholder="Minutos"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div>
                                    <label className={labelClass}>Falha/Risco (%)</label>
                                    <input
                                        type="number"
                                        value={formData.falha_risco}
                                        onChange={e => setFormData({...formData, falha_risco: e.target.value})}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Lucro Desejado (%)</label>
                                    <input
                                        type="number"
                                        value={formData.lucro_desejado}
                                        onChange={e => setFormData({...formData, lucro_desejado: e.target.value})}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="bg-[#FF9B54]/10 dark:bg-orange-500/5 p-4 rounded-xl border border-[#FF9B54]/20 dark:border-orange-500/20 transition-colors">
                                <label className="block text-[10px] font-black text-[#FF9B54] uppercase tracking-widest mb-2">Preço Sugerido / Editável (Total do Item)</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-[#FF9B54]">R$</span>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={itemPrecoManual} 
                                        onChange={e => setItemPrecoManual(e.target.value)} 
                                        className="w-full bg-white dark:bg-gray-800 px-4 py-2 border border-[#FF9B54]/30 rounded-xl text-lg font-black text-[#2A3240] dark:text-white outline-none focus:border-[#FF9B54] transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={adicionarItem}
                                className="w-full bg-[#FF9B54] text-white font-black py-4 rounded-xl shadow-lg uppercase text-xs tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Adicionar Peça ao Orçamento
                            </button>
                        </div>

                        {/* Lista de Itens Adicionados */}
                        {itens.length > 0 && (
                            <div className="bg-[#2A3240] dark:bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden transition-colors">
                                <div className="p-6 border-b border-gray-700 dark:border-gray-700/50 flex justify-between items-center">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Itens do Pedido ({itens.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-black/20 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">Item</th>
                                                <th className="px-6 py-4">Material</th>
                                                <th className="px-6 py-4">Qtd</th>
                                                <th className="px-6 py-4 text-right">Preço</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700 dark:divide-gray-700/50">
                                            {itens.map((item) => (
                                                <tr key={item.id} className="text-white hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold">{item.nome}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase font-bold">{item.tamanho}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">{item.material_nome}</td>
                                                    <td className="px-6 py-4 text-sm font-black">{item.quantidade}x</td>
                                                    <td className="px-6 py-4 text-right font-black text-[#FF9B54]">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <span className="text-[10px] text-gray-400">R$</span>
                                                            <input 
                                                                type="number" 
                                                                step="0.01"
                                                                value={item.preco} 
                                                                onChange={(e) => handleItemPrecoChange(item.id, e.target.value)}
                                                                className="w-24 bg-black/30 border border-gray-700 rounded px-2 py-1 text-right outline-none focus:border-[#FF9B54] text-sm"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => removerItem(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resultados Finais e Configurações de Máquina */}
                    <div className="space-y-8">
                        {/* Configurações de Máquina (Energia/Depreciação) */}
                        <div className="bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4 transition-colors">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Padrões de Máquina</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase">Consumo (W)</label>
                                    <input type="number" value={formData.consumo_watts} onChange={e => setFormData({...formData, consumo_watts: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-xs dark:text-gray-200" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase">Preço kWh</label>
                                    <input type="number" step="0.01" value={formData.kwh_preco} onChange={e => setFormData({...formData, kwh_preco: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-xs dark:text-gray-200" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase">Vlr. Máquina</label>
                                    <input type="number" value={formData.valor_impressora} onChange={e => setFormData({...formData, valor_impressora: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-xs dark:text-gray-200" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase">Vida Útil (h)</label>
                                    <input type="number" value={formData.vida_util_horas} onChange={e => setFormData({...formData, vida_util_horas: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-bold text-xs dark:text-gray-200" />
                                </div>
                            </div>
                        </div>

                        {/* Resumo Financeiro */}
                        <div className={`bg-[#2A3240] dark:bg-gray-800/80 p-8 rounded-2xl shadow-xl text-white transition-all duration-300 ${calculado ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <h3 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-gray-700 dark:border-gray-700/50 pb-4 text-[#FF9B54]">Total do Pedido</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Custo de Produção</span>
                                    <span className="font-black text-lg">R$ {totais.custo_total}</span>
                                </div>
                                
                                <div className="bg-white/5 dark:bg-black/20 p-6 rounded-2xl border border-white/10 dark:border-white/5 mt-8 transition-colors">
                                    <span className="block text-[10px] font-black text-[#FF9B54] uppercase mb-1 tracking-widest">Preço Final Sugerido</span>
                                    {editandoPreco ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={precoEditado}
                                                onChange={e => handlePrecoChange(e.target.value)}
                                                onBlur={() => setEditandoPreco(false)}
                                                onKeyDown={e => e.key === 'Enter' && setEditandoPreco(false)}
                                                autoFocus
                                                className="bg-white/10 text-white text-3xl font-black rounded-lg px-3 py-1 outline-none border border-[#FF9B54] w-full"
                                            />
                                        </div>
                                    ) : (
                                        <p
                                            className="text-4xl font-black cursor-pointer hover:text-[#FF9B54] transition-all"
                                            onClick={() => setEditandoPreco(true)}
                                            title="Clique para editar"
                                        >
                                            R$ {totais.preco_venda}
                                        </p>
                                    )}
                                    <span className="block text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase mt-2 tracking-tighter italic">Clique no valor para ajustar manualmente</span>
                                    <div className={`mt-6 pt-6 border-t border-white/5 flex justify-between items-center`}>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Lucro Estimado</span>
                                        <span className={`text-xl font-black ${parseFloat(totais.lucro_liquido) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            R$ {totais.lucro_liquido}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading || itens.length === 0}
                                onClick={handleSalvarOrcamento}
                                className="w-full mt-8 bg-[#FF9B54] text-white font-black py-5 rounded-xl shadow-lg uppercase text-xs tracking-[2px] disabled:opacity-50 hover:bg-orange-600 hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {loading ? 'Salvando...' : 'Gerar Orçamento Completo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
