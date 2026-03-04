import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
// Importação do banco de dados de impressoras
import { listaImpressoras } from '../../data/impressoras';

export default function CalculadoraPrecificacao() {
    const [formData, setFormData] = useState({
        nome: '',
        precoFilamento: '',
        peso: '',
        horas: '',
        minutos: '',
        kwh: '1.25',
        impressoraId: 'cr_ender3', // ID Padrão
        impressoraNome: 'Creality Ender 3 / Pro / V2', // Nome para exibição
        potencia: '150',
        margem: '250'
    });

    const [resultados, setResultados] = useState({
        custoFilamento: 0, custoEnergia: 0, custoTotal: 0, precoVenda: 0, lucro: 0
    });

    // Estados para o campo de busca de impressoras
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const dropdownRef = useRef(null);

    // Fecha o dropdown se clicar fora dele
    useEffect(() => {
        const handleClickFora = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownAberto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFora);
        return () => document.removeEventListener('mousedown', handleClickFora);
    }, []);

    // Motor de cálculo em tempo real
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setMargemRapida = (valor) => {
        setFormData(prev => ({ ...prev, margem: valor }));
    };

    // Função para quando o usuário seleciona uma impressora na lista buscada
    const selecionarImpressora = (impressora) => {
        setFormData(prev => ({
            ...prev,
            impressoraId: impressora.id,
            impressoraNome: impressora.nome,
            potencia: impressora.watts
        }));
        setTermoBusca('');
        setDropdownAberto(false);
    };

    // Filtra as impressoras baseadas no que o usuário digitou
    const impressorasFiltradas = listaImpressoras.filter(imp =>
        imp.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#2A3240]">Calculadora de Precificação 3D</h2>
                <p className="text-sm text-gray-600 mt-1">Calcule com precisão os custos e defina preços justos e lucrativos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUNA ESQUERDA */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-[#2A3240] mb-6 border-b pb-2">Variáveis de Custo</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#2A3240] mb-1">Nome do Produto</label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Vaso Geométrico" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Preço do Material (R$/kg ou Litro)</label>
                                <input type="number" name="precoFilamento" value={formData.precoFilamento} onChange={handleChange} placeholder="Ex: 120.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Material Utilizado (Gramas ou ML)</label>
                                <input type="number" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ex: 150" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Tempo de Impressão (Horas)</label>
                                <input type="number" name="horas" value={formData.horas} onChange={handleChange} placeholder="Ex: 4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Minutos Adicionais</label>
                                <input type="number" name="minutos" value={formData.minutos} onChange={handleChange} placeholder="Ex: 30" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none" />
                            </div>
                        </div>

                        {/* SEÇÃO DE ENERGIA COM CAMPO DE BUSCA (COMBOBOX) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-gray-100 pt-6">

                            <div className="md:col-span-3">
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Tarifa (R$/kWh)</label>
                                <input type="number" name="kwh" step="0.01" value={formData.kwh} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none bg-gray-50" />
                            </div>

                            {/* Campo de Busca Inteligente de Impressora */}
                            <div className="md:col-span-6 relative" ref={dropdownRef}>
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Máquina (Busque a sua)</label>
                                <div
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-text bg-white flex justify-between items-center"
                                    onClick={() => setDropdownAberto(true)}
                                >
                                    <span className={`truncate ${dropdownAberto ? 'hidden' : 'block'}`}>
                                        {formData.impressoraNome}
                                    </span>

                                    {dropdownAberto && (
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Digite o modelo..."
                                            value={termoBusca}
                                            onChange={(e) => setTermoBusca(e.target.value)}
                                            className="w-full outline-none bg-transparent"
                                        />
                                    )}

                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>

                                {/* Lista Suspensa (Dropdown) */}
                                {dropdownAberto && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                        {impressorasFiltradas.length > 0 ? (
                                            impressorasFiltradas.map((imp) => (
                                                <div
                                                    key={imp.id}
                                                    onClick={() => selecionarImpressora(imp)}
                                                    className="px-4 py-2 hover:bg-[#FF9B54] hover:text-white cursor-pointer text-sm text-[#2A3240] border-b border-gray-50 last:border-0 transition-colors"
                                                >
                                                    <span className="font-semibold">{imp.nome}</span>
                                                    {imp.watts && <span className="ml-2 text-xs opacity-75">({imp.watts}W)</span>}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                Impressora não encontrada. <br />
                                                <span onClick={() => selecionarImpressora({ id: 'custom', nome: 'Outra / Digitar Manualmente', watts: '' })} className="text-[#FF9B54] font-bold cursor-pointer hover:underline">
                                                    Clique aqui para digitar manualmente
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-semibold text-[#2A3240] mb-1">Consumo (Watts)</label>
                                <input
                                    type="number"
                                    name="potencia"
                                    value={formData.potencia}
                                    onChange={handleChange}
                                    disabled={formData.impressoraId !== 'custom'}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none ${formData.impressoraId !== 'custom' ? 'bg-gray-100 cursor-not-allowed text-[#2A3240] font-bold' : 'bg-white'}`}
                                />
                            </div>

                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <label className="block text-sm font-semibold text-[#2A3240] mb-3">Margem de Lucro Desejada (%)</label>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <button type="button" onClick={() => setMargemRapida('100')} className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${formData.margem === '100' ? 'bg-[#2A3240] text-white border-[#2A3240]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>Conservador (100%)</button>
                                <button type="button" onClick={() => setMargemRapida('250')} className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${formData.margem === '250' ? 'bg-[#FF9B54] text-white border-[#FF9B54]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>Normal (250%)</button>
                                <button type="button" onClick={() => setMargemRapida('500')} className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${formData.margem === '500' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>Agressivo (500%)</button>
                            </div>
                            <input type="number" name="margem" value={formData.margem} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A3240] focus:outline-none" placeholder="Personalizado (%)" />
                        </div>

                    </div>
                </div>

                {/* COLUNA DIREITA */}
                <div className="lg:col-span-1">
                    <div className="bg-[#2A3240] rounded-xl shadow-lg p-6 text-white sticky top-6 border-t-4 border-[#FF9B54]">
                        <h3 className="text-xl font-bold mb-6 text-center">Resumo da Precificação</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-600">
                                <span className="text-gray-300">Produto:</span>
                                <span className="font-bold truncate max-w-[150px]">{formData.nome || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-600">
                                <span className="text-gray-300">Custo Material:</span>
                                <span className="font-medium">R$ {resultados.custoFilamento.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-600">
                                <span className="text-gray-300">Custo Energia:</span>
                                <span className="font-medium">R$ {resultados.custoEnergia.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-600">
                                <span className="text-gray-300 font-bold">Custo Total:</span>
                                <span className="font-bold text-red-400">R$ {resultados.custoTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-600">
                                <span className="text-gray-300 font-bold">Lucro Projetado:</span>
                                <span className="font-bold text-green-400">R$ {resultados.lucro.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-8 bg-white text-[#2A3240] p-4 rounded-lg text-center shadow-inner">
                            <span className="block text-xs font-bold uppercase text-gray-500 mb-1">Preço de Venda Sugerido</span>
                            <span className="text-3xl font-extrabold text-[#FF9B54]">
                                R$ {resultados.precoVenda.toFixed(2)}
                            </span>
                        </div>
                        <button className="w-full mt-6 bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors uppercase text-sm tracking-wider">
                            Salvar Produto no Estoque
                        </button>
                    </div>
                </div>

            </div>
        </Layout>
    );
}