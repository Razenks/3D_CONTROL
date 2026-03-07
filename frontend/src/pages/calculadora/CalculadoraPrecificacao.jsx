import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import { listaImpressoras } from '../../data/impressoras';
import { useNavigate } from 'react-router-dom';

export default function CalculadoraPrecificacao() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        clienteId: '',
        precoFilamento: '',
        peso: '',
        horas: '',
        minutos: '',
        kwh: '1.25',
        impressoraId: 'cr_ender3',
        impressoraNome: 'Creality Ender 3 / Pro / V2',
        potencia: '150',
        margem: '250'
    });

    const [clientes, setClientes] = useState([]);
    const [materiaisEstoque, setMateriaisEstoque] = useState([]);
    const [resultados, setResultados] = useState({
        custoFilamento: 0, custoEnergia: 0, custoTotal: 0, precoVenda: 0, lucro: 0
    });

    const [loading, setLoading] = useState(false);
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const dropdownRef = useRef(null);

    // Buscar clientes ATIVOS e materiais ATIVOS
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('auth_token');
            try {
                const [resC, resM] = await Promise.all([
                    fetch('http://localhost:8000/api/clientes?ativos_only=1', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:8000/api/materiais?ativos_only=1', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                if (resC.ok) setClientes(await resC.json());
                if (resM.ok) setMateriaisEstoque(await resM.json());
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const precoFil = parseFloat(formData.precoFilamento) || 0;
        const pesoGrama = parseFloat(formData.peso) || 0;
        const hrs = parseFloat(formData.horas) || 0;
        const mins = parseFloat(formData.minutos) || 0;
        const tarifaKwh = parseFloat(formData.kwh) || 0;
        const watts = parseFloat(formData.potencia) || 0;
        const margemPercentual = parseFloat(formData.margem) || 0;

        const calcCustoFilamento = (precoFil / 1000) * pesoGrama;
        const tempoTotalHoras = hrs + (mins / 60);
        const calcCustoEnergia = (watts / 1000) * tempoTotalHoras * tarifaKwh;
        const calcCustoTotal = calcCustoFilamento + calcCustoEnergia;
        const calcPrecoVenda = calcCustoTotal * (1 + (margemPercentual / 100));
        const calcLucro = calcPrecoVenda - calcCustoTotal;

        setResultados({
            custoFilamento: calcCustoFilamento,
            custoEnergia: calcCustoEnergia,
            custoTotal: calcCustoTotal,
            precoVenda: calcPrecoVenda,
            lucro: calcLucro
        });
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Se selecionar um material do estoque, preenche o preço automaticamente
        if (name === 'materialEstoqueId') {
            const mat = materiaisEstoque.find(m => m.id === parseInt(value));
            if (mat) {
                setFormData(prev => ({ ...prev, precoFilamento: mat.custo_unidade }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selecionarImpressora = (impressora) => {
        setFormData(prev => ({
            ...prev,
            impressoraId: impressora.id,
            impressoraNome: impressora.nome,
            potencia: impressora.watts
        }));
        setDropdownAberto(false);
    };

    const handleSalvarOrcamento = async () => {
        if (!formData.nome) {
            alert('Informe o nome do projeto.');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const clienteSelecionado = clientes.find(c => c.id === parseInt(formData.clienteId));

        const payload = {
            cliente_id: formData.clienteId || null,
            cliente: clienteSelecionado ? clienteSelecionado.nome : 'Consumidor Final',
            projeto: formData.nome,
            valor_total: resultados.precoVenda,
            custo_estimado: resultados.custoTotal,
            lucro_estimado: resultados.lucro,
            detalhes_calculo: formData
        };

        try {
            const response = await fetch('http://localhost:8000/api/orcamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Orçamento salvo!');
                navigate('/orcamentos');
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const impressorasFiltradas = listaImpressoras.filter(imp =>
        imp.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-[#2A3240] uppercase tracking-tighter">Calculadora RB Printings</h2>
                    <p className="text-sm text-gray-500 font-medium">Gere orçamentos precisos e profissionais.</p>
                </div>
                <div className="w-full sm:w-auto">
                    <select 
                        name="clienteId"
                        value={formData.clienteId}
                        onChange={handleChange}
                        className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#2A3240] focus:ring-2 focus:ring-[#FF9B54] outline-none min-w-[200px]"
                    >
                        <option value="">Consumidor Final</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-[#2A3240] mb-6 border-b pb-2 uppercase tracking-tight">Variáveis de Custo</h3>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome do Projeto/Peça</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Action Figure Batman" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]" />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Insumo do Estoque</label>
                                <select 
                                    name="materialEstoqueId"
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none text-xs font-bold"
                                >
                                    <option value="">Digitar preço manualmente...</option>
                                    {materiaisEstoque.map(m => <option key={m.id} value={m.id}>{m.tipo} - {m.marca?.nome} ({m.cor?.nome})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Preço do Material (R$/kg)</label>
                                <input type="number" name="precoFilamento" value={formData.precoFilamento} onChange={handleChange} placeholder="Ex: 120.00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Peso da Peça (Gramas)</label>
                                <input type="number" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ex: 150" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]" />
                            </div>
                            <div className="relative">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Máquina (Perfil)</label>
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center cursor-pointer" onClick={() => setDropdownAberto(true)}>
                                    <span className="font-bold text-[#2A3240] truncate text-xs">{formData.impressoraNome} ({formData.potencia}W)</span>
                                </div>
                                {dropdownAberto && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                        <input type="text" placeholder="Filtrar..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} className="w-full p-3 border-b outline-none text-xs font-bold" autoFocus />
                                        {impressorasFiltradas.map((imp) => (
                                            <div key={imp.id} onClick={() => selecionarImpressora(imp)} className="px-4 py-3 hover:bg-[#FF9B54] hover:text-white cursor-pointer text-[10px] font-bold border-b border-gray-50 transition-colors uppercase">
                                                {imp.nome} <span className="ml-2 opacity-60">({imp.watts}W)</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tempo (Horas)</label>
                                <input type="number" name="horas" value={formData.horas} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tempo (Minutos)</label>
                                <input type="number" name="minutos" value={formData.minutos} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]" />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Margem de Lucro (%)</label>
                            <input type="number" name="margem" value={formData.margem} onChange={handleChange} className="w-full md:w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9B54] outline-none font-bold text-[#2A3240]" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-[#2A3240] rounded-2xl shadow-2xl p-8 text-white lg:sticky lg:top-6 border-t-8 border-[#FF9B54]">
                        <h3 className="text-xl font-black mb-8 text-center uppercase tracking-tighter">Resumo RB</h3>
                        <div className="space-y-5 text-xs font-bold uppercase tracking-wider">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                                <span className="text-gray-400">Custo Base:</span>
                                <span className="text-red-400">R$ {resultados.custoTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                                <span className="text-gray-400 text-green-400">Margem RB:</span>
                                <span className="text-green-400 text-lg">R$ {resultados.lucro.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-10 bg-white p-6 rounded-2xl text-center shadow-inner">
                            <span className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Preço Final</span>
                            <span className="text-4xl font-black text-[#2A3240]">
                                R$ {resultados.precoVenda.toFixed(2)}
                            </span>
                        </div>
                        <button onClick={handleSalvarOrcamento} disabled={loading} className="w-full mt-10 bg-[#FF9B54] hover:bg-orange-500 text-[#2A3240] font-black py-4 px-4 rounded-xl shadow-xl transition-all uppercase text-xs tracking-widest disabled:opacity-50">
                            {loading ? 'Salvando...' : 'Gerar Orçamento'}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
