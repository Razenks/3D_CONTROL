import React, { useRef } from 'react';
import ReportSummaryCard from './ReportSummaryCard';
import ReportTable from './ReportTable';
import ReportCharts from './ReportCharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ModalVisualizarRelatorio({ isOpen, onClose, data, tipo, periodo }) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadFromModal = async () => {
    if (!printRef.current) return;
    
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`relatorio-${tipo}.pdf`);
    } catch (err) {
      alert('Erro ao gerar PDF');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-0 md:p-10">
      <div className="bg-gray-100 w-full h-full md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header do Modal */}
        <div className="bg-[#2A3240] p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold uppercase">Visualização do Relatório</h3>
            <p className="text-xs text-gray-400">Tipo: {tipo} | Período: Últimos {periodo} dias</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleDownloadFromModal}
              className="bg-[#FF9B54] hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              Baixar PDF
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* Área do Relatório (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div ref={printRef} className="max-w-5xl mx-auto bg-gray-50 p-6 md:p-10 rounded-xl shadow-inner">
            <div className="mb-10 text-center border-b pb-8">
                <h1 className="text-3xl font-black text-[#2A3240] uppercase tracking-tighter">RB PRINTINGS - Gestão 3D</h1>
                <p className="text-gray-500 font-medium">Relatório Analítico de Produção e Vendas</p>
                <div className="mt-4 text-xs font-bold text-gray-400 uppercase">Gerado em: {new Date().toLocaleString()}</div>
            </div>

            {tipo === 'geral' && (
                <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <ReportSummaryCard titulo="Faturamento" valor={data.stats.faturamento} icone="R$" cor="bg-green-50 text-green-600" />
                    <ReportSummaryCard titulo="Lucro" valor={data.stats.lucro} icone="L" cor="bg-blue-50 text-blue-600" />
                    <ReportSummaryCard titulo="Consumo" valor={data.stats.consumoMaterial} icone="kg" cor="bg-purple-50 text-purple-600" />
                    <ReportSummaryCard titulo="Impressões" valor={data.stats.totalImpressoes} icone="P" cor="bg-orange-50 text-orange-600" />
                </div>
                <ReportCharts data={data} tipo={tipo} />
                <div className="mt-10">
                    <ReportTable titulo="Ranking de Produtos" colunas={['ID', 'Produto', 'Qtd', 'Total']} data={data.topProdutos} />
                </div>
                </>
            )}

            {tipo === 'material' && (
                <>
                <div className="mb-10">
                    <ReportSummaryCard titulo="Consumo Total de Filamento" valor={data.stats.total_consumo} icone="kg" cor="bg-purple-50 text-purple-600" />
                </div>
                <ReportCharts data={data} tipo={tipo} />
                <div className="mt-10">
                    <ReportTable titulo="Detalhamento por Material" colunas={['Material', 'Peso (g)']} data={data.detalhes.map(d => ({ m: d.material, p: d.total_peso + 'g' }))} />
                </div>
                </>
            )}

            {tipo === 'orcamentos' && (
                <>
                <ReportCharts data={data} tipo={tipo} />
                <div className="mt-10">
                    <ReportTable titulo="Distribuição por Status" colunas={['Status', 'Total', 'Valor']} data={data.detalhes.map(d => ({ s: d.status, t: d.total, v: 'R$ ' + d.valor }))} />
                </div>
                </>
            )}

            <div className="mt-20 pt-8 border-t border-gray-200 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Documento gerado automaticamente pelo sistema 3D Control
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
