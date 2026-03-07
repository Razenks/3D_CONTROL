import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import ReportSummaryCard from './components/ReportSummaryCard';
import ReportTable from './components/ReportTable';
import ReportCharts from './components/ReportCharts';
import ModalVisualizarRelatorio from './components/ModalVisualizarRelatorio';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Relatorios() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodo, setPeriodo] = useState('30'); 
  const [tipo, setTipo] = useState('geral'); // geral, material, orcamentos
  const [data, setData] = useState({
    stats: {},
    topProdutos: [],
    detalhes: []
  });

  const reportRef = useRef(null);

  const fetchRelatorios = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`http://localhost:8000/api/relatorios?periodo=${periodo}&tipo=${tipo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error('Erro ao buscar relatórios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, [periodo, tipo]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#F9FAFB'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`relatorio-3d-control-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest animate-pulse">Gerando relatório analítico...</div></Layout>;

  return (
    <Layout>
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">
            Dashboards de Performance
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1 italic">
            Visualização de métricas, consumo e faturamento da sua produção 3D.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</label>
            <select 
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#2A3240] focus:ring-2 focus:ring-[#FF9B54] outline-none transition-all"
            >
              <option value="geral">Finanças & Top Itens</option>
              <option value="material">Uso de Filamento</option>
              <option value="orcamentos">Funil de Orçamentos</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tempo</label>
            <select 
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#2A3240] focus:ring-2 focus:ring-[#FF9B54] outline-none transition-all"
            >
              <option value="7">7 Dias</option>
              <option value="30">30 Dias</option>
              <option value="90">90 Dias</option>
            </select>
          </div>

          <div className="flex gap-2 ml-2">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#2A3240] hover:bg-gray-700 text-white font-black py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all text-[10px] uppercase tracking-widest shadow-md"
              >
                Visualizar
              </button>

              <button 
                onClick={handleExportPDF}
                disabled={exporting}
                className="bg-[#FF9B54] hover:bg-orange-500 text-white font-black py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all text-[10px] uppercase tracking-widest shadow-md disabled:opacity-50"
              >
                {exporting ? 'Gerando...' : 'PDF'}
              </button>
          </div>
        </div>
      </div>

      <div ref={reportRef} className="rounded-2xl space-y-8">
          {tipo === 'geral' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportSummaryCard titulo="Faturamento" valor={data.stats.faturamento} descricao="Vendas aprovadas" icone="R$" cor="bg-green-50 text-green-600" />
                <ReportSummaryCard titulo="Lucro Bruto" valor={data.stats.lucro} descricao="Margem aplicada" icone="L" cor="bg-blue-50 text-blue-600" />
                <ReportSummaryCard titulo="Material" valor={data.stats.consumoMaterial} descricao="Uso em kg" icone="kg" cor="bg-purple-50 text-purple-600" />
                <ReportSummaryCard titulo="Peças" valor={data.stats.totalImpressoes} descricao="Concluídas" icone="P" cor="bg-orange-50 text-orange-600" />
              </div>
              
              <ReportCharts data={data} tipo={tipo} />

              <ReportTable titulo="Produtos de Alta Performance" colunas={['ID', 'Produto', 'Vendas', 'Faturamento']} data={data.topProdutos} />
            </>
          )}

          {tipo === 'material' && (
            <>
              <div className="max-w-md">
                 <ReportSummaryCard titulo="Consumo Total Acumulado" valor={data.stats.total_consumo} descricao="Filamento processado" icone="kg" cor="bg-purple-50 text-purple-600" />
              </div>
              
              <ReportCharts data={data} tipo={tipo} />

              <ReportTable 
                    titulo="Ranking de Consumo por Insumo" 
                    colunas={['Material', 'Grama (g)']} 
                    data={data.detalhes.map(d => ({ material: d.material || 'N/A', peso: d.total_peso + 'g' }))} 
                />
            </>
          )}

          {tipo === 'orcamentos' && (
            <>
              <ReportCharts data={data} tipo={tipo} />

              <ReportTable 
                titulo="Status do Pipeline de Vendas" 
                colunas={['Etapa', 'Quantidade', 'Valor Potencial']} 
                data={data.detalhes.map(d => ({ status: d.status, total: d.total, valor: 'R$ ' + parseFloat(d.valor).toFixed(2) }))} 
              />
            </>
          )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO COMPLETA */}
      <ModalVisualizarRelatorio 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        tipo={tipo}
        periodo={periodo}
      />
    </Layout>
  );
}
