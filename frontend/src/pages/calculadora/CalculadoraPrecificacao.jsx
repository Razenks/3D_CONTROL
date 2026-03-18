import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import API_BASE_URL from '../../config';

export default function CalculadoraPrecificacao() {
    const [materiais, setMateriais] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [calculado, setCalculado] = useState(false);

    const [formData, setFormData] = useState({
        cliente_id: '',
        projeto: '',
        material_id: '',
        peso: '',
        horas: '',
        minutos: '',
        falha_risco: '10',
        lucro_desejado: '100',
        quantidade: '1'
    });

    const [resultados, setResultados] = useState({
        custo_material: 0,
        custo_energia: 0,
        custo_total: 0,
        preco_venda: 0,
        lucro_liquido: 0
    });

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

    const calcular = () => {
        const mat = materiais.find(m => m.id === parseInt(formData.material_id));
        if (!mat) return;

        const peso = parseFloat(formData.peso);
        const custoPorG = parseFloat(mat.custo_unidade) / 1000;
        const custoMaterial = peso * custoPorG;

        const tempoTotalH = parseFloat(formData.horas || 0) + (parseFloat(formData.minutos || 0) / 60);
        const custoEnergia = tempoTotalH * 0.50; // R$ 0.50 por hora (estimado)

        const custoBase = custoMaterial + custoEnergia;
        const risco = custoBase * (parseFloat(formData.falha_risco) / 100);
        
        const custoTotalUnidade = custoBase + risco;
        const margem = 1 + (parseFloat(formData.lucro_desejado) / 100);
        
        const precoVendaUnidade = custoTotalUnidade * margem;
        const quantidade = parseInt(formData.quantidade);

        setResultados({
            custo_material: (custoMaterial * quantidade).toFixed(2),
            custo_energia: (custoEnergia * quantidade).toFixed(2),
            custo_total: (custoTotalUnidade * quantidade).toFixed(2),
            preco_venda: (precoVendaUnidade * quantidade).toFixed(2),
            lucro_liquido: ((precoVendaUnidade - custoTotalUnidade) * quantidade).toFixed(2)
        });
        setCalculado(true);
    };

    const handleSalvarOrcamento = async () => {
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
                    valor_total: resultados.preco_venda,
                    custo_estimado: resultados.custo_total,
                    lucro_estimado: resultados.lucro_liquido,
                    status: 'Pendente',
                    detalhes_calculo: { ...formData, material_nome: materiais.find(m => m.id === parseInt(formData.material_id))?.tipo }
                })
            });

            if (response.ok) {
                alert('Orçamento gerado com sucesso!');
                setCalculado(false);
                setFormData({ ...formData, projeto: '', peso: '', horas: '', minutos: '' });
            }
        } catch (err) { alert('Erro ao salvar orçamento'); }
        finally { setLoading(false); }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">Calculadora de Precificação</h2>
                    <p className="text-sm text-gray-500 font-medium">Calcule custos e gere orçamentos profissionais.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Formulário */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cliente</label>
                            <select 
                                value={formData.cliente_id} 
                                onChange={e => setFormData({...formData, cliente_id: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                            >
                                <option value="">Selecione o cliente...</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome do Projeto</label>
                            <input 
                                type="text" 
                                value={formData.projeto} 
                                onChange={e => setFormData({...formData, projeto: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                placeholder="Ex: Action Figure Batman"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Material</label>
                                <select 
                                    value={formData.material_id} 
                                    onChange={e => setFormData({...formData, material_id: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                >
                                    <option value="">Selecione...</option>
                                    {materiais.map(m => <option key={m.id} value={m.id}>{m.tipo} - {m.cor?.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Peso (g)</label>
                                <input 
                                    type="number" 
                                    value={formData.peso} 
                                    onChange={e => setFormData({...formData, peso: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                    placeholder="Ex: 150"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tempo (Horas)</label>
                                <input 
                                    type="number" 
                                    value={formData.horas} 
                                    onChange={e => setFormData({...formData, horas: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                    placeholder="Horas"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Minutos</label>
                                <input 
                                    type="number" 
                                    value={formData.minutos} 
                                    onChange={e => setFormData({...formData, minutos: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                    placeholder="Minutos"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Falha/Risco (%)</label>
                                <input 
                                    type="number" 
                                    value={formData.falha_risco} 
                                    onChange={e => setFormData({...formData, falha_risco: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                    placeholder="Ex: 10"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Lucro Desejado (%)</label>
                                <input 
                                    type="number" 
                                    value={formData.lucro_desejado} 
                                    onChange={e => setFormData({...formData, lucro_desejado: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-[#2A3240]"
                                    placeholder="Ex: 100"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={calcular}
                            className="w-full bg-[#2A3240] text-white font-black py-4 rounded-xl shadow-lg uppercase text-xs tracking-widest hover:bg-gray-800 transition-all"
                        >Calcular Agora</button>
                    </div>

                    {/* Resultados */}
                    <div className={`bg-[#2A3240] p-8 rounded-2xl shadow-xl text-white transition-all ${calculado ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <h3 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-gray-700 pb-4 text-[#FF9B54]">Resultados do Cálculo</h3>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase">Custo Material</span>
                                <span className="font-black">R$ {resultados.custo_material}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase">Energia (Est.)</span>
                                <span className="font-black">R$ {resultados.custo_energia}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-700">
                                <span className="text-xs font-bold text-gray-400 uppercase">Custo Total</span>
                                <span className="text-xl font-black">R$ {resultados.custo_total}</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
                                <span className="block text-[10px] font-black text-[#FF9B54] uppercase mb-1">Preço de Venda Sugerido</span>
                                <p className="text-4xl font-black">R$ {resultados.preco_venda}</p>
                                <span className="block text-[10px] font-black text-green-400 uppercase mt-2">Lucro Líquido: R$ {resultados.lucro_liquido}</span>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            onClick={handleSalvarOrcamento}
                            className="w-full mt-8 bg-[#FF9B54] text-white font-black py-4 rounded-xl shadow-lg uppercase text-xs tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Gerar Orçamento'}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
