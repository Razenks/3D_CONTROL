import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../../assets/logo.png';

export default function ModeloOrcamentoCliente({ isOpen, onClose, orcamento }) {
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  if (!isOpen || !orcamento) return null;

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`orcamento-${orcamento.id}-${orcamento.cliente || 'cliente'}.pdf`);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro técnico ao gerar o arquivo.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 md:p-4 overflow-y-auto">
      {/* Container do Modal que se ajusta à tela */}
      <div className="bg-white w-full max-w-[900px] max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header de Controle */}
        <div className="bg-[#2A3240] p-4 text-white flex justify-between items-center shrink-0">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-[10px] uppercase tracking-widest">Visualização de Impressão</span>
          </div>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-[#FF9B54] hover:bg-orange-500 text-[#2A3240] px-4 sm:px-8 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 uppercase"
            >
              {exporting ? 'GERANDO...' : 'BAIXAR PDF'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* ÁREA DE VISUALIZAÇÃO COM ZOOM RESPONSIVO */}
        <div className="flex-1 bg-gray-200 overflow-auto p-4 md:p-8 flex justify-center items-start">
          {/* Este wrapper faz o "mágica" do zoom */}
          <div style={{ 
            transform: 'scale(var(--zoom-level, 0.6))', 
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
          className="responsive-pdf-wrapper"
          >
            {/* O DOCUMENTO REAL (794px fixos para o PDF ser perfeito) */}
            <div 
                ref={printRef} 
                style={{ 
                    width: '794px', 
                    height: '1123px', 
                    backgroundColor: '#ffffff',
                    padding: '60px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    fontFamily: 'Arial, sans-serif',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Estilo para ajustar o zoom via CSS variável baseada na largura da tela */}
                <style dangerouslySetInnerHTML={{ __html: `
                    .responsive-pdf-wrapper { --zoom-level: 1; }
                    @media (max-width: 900px) { .responsive-pdf-wrapper { --zoom-level: 0.85; } }
                    @media (max-width: 750px) { .responsive-pdf-wrapper { --zoom-level: 0.7; } }
                    @media (max-width: 600px) { .responsive-pdf-wrapper { --zoom-level: 0.55; } }
                    @media (max-width: 450px) { .responsive-pdf-wrapper { --zoom-level: 0.4; } }
                    @media (max-width: 350px) { .responsive-pdf-wrapper { --zoom-level: 0.3; } }
                `}} />

                {/* CONTEÚDO DO DOCUMENTO (IGUAL AO ANTERIOR) */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px', backgroundColor: '#2A3240' }}></div>
                <div style={{ position: 'absolute', left: 0, top: '150px', height: '100px', width: '8px', backgroundColor: '#FF9B54' }}></div>

                <table style={{ width: '100%', marginBottom: '50px' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '60%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img src={logo} alt="Logo" style={{ height: '70px', width: 'auto' }} />
                                    <div>
                                        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#2A3240', letterSpacing: '-1px' }}>
                                            RB <span style={{ color: '#FF9B54' }}>PRINTINGS</span>
                                        </h1>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '10px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                            Tecnologia em Impressão 3D
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td style={{ width: '40%', textAlign: 'right' }}>
                                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1F2937', textTransform: 'uppercase' }}>Orçamento</h2>
                                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#FF9B54' }}># {orcamento.id.toString().padStart(5, '0')}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6B7280' }}>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table style={{ width: '100%', marginBottom: '40px', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%', paddingRight: '20px', verticalAlign: 'top' }}>
                                <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Dados do Solicitante</h3>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#2A3240' }}>{orcamento.cliente || 'Prezado(a) Cliente'}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6B7280' }}>Projeto: <span style={{ fontWeight: 'bold', color: '#2A3240' }}>{orcamento.projeto}</span></p>
                            </td>
                            <td style={{ width: '50%', verticalAlign: 'top' }}>
                                <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', padding: '20px', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '1px' }}>Validade</h3>
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#2A3240' }}>Proposta válida por 10 dias úteis.</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#9CA3AF' }}>Sujeito a reajuste após este período.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ marginBottom: '40px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#2A3240' }}>
                                <th style={{ padding: '15px 20px', color: '#ffffff', textAlign: 'left', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', borderRadius: '10px 0 0 0' }}>Descrição Técnica</th>
                                <th style={{ padding: '15px 20px', color: '#ffffff', textAlign: 'center', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', width: '100px' }}>Qtd.</th>
                                <th style={{ padding: '15px 20px', color: '#ffffff', textAlign: 'right', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', borderRadius: '0 10px 0 0', width: '150px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '30px 20px', borderBottom: '1px solid #F3F4F6' }}>
                                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#2A3240' }}>{orcamento.projeto}</p>
                                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>
                                        Manufatura aditiva de alta precisão.<br />
                                        Material: <span style={{ fontWeight: 'bold' }}>{orcamento.detalhes_calculo?.material || 'Filamento Premium'}</span><br />
                                        Peso final estimado: <span style={{ fontWeight: 'bold' }}>{orcamento.detalhes_calculo?.peso || '0'}g</span>
                                    </p>
                                </td>
                                <td style={{ padding: '30px 20px', borderBottom: '1px solid #F3F4F6', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#2A3240' }}>01</td>
                                <td style={{ padding: '30px 20px', borderBottom: '1px solid #F3F4F6', textAlign: 'right', fontSize: '20px', fontWeight: '900', color: '#2A3240' }}>
                                    R$ {parseFloat(orcamento.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table style={{ width: '100%', marginTop: 'auto' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '55%', verticalAlign: 'bottom', paddingBottom: '20px' }}>
                                <h4 style={{ fontSize: '10px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid #E5E7EB', paddingBottom: '5px' }}>Termos</h4>
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '11px', color: '#6B7280' }}>
                                    <li style={{ marginBottom: '8px' }}>• Prazo de entrega a combinar.</li>
                                    <li style={{ marginBottom: '8px' }}>• Garantia contra defeitos de fabricação.</li>
                                </ul>
                            </td>
                            <td style={{ width: '45%', verticalAlign: 'bottom' }}>
                                <div style={{ backgroundColor: '#2A3240', padding: '35px', borderRadius: '24px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '6px 15px', backgroundColor: '#FF9B54', color: '#2A3240', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Total</div>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase' }}>Investimento</p>
                                    <p style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#ffffff' }}>
                                        <span style={{ fontSize: '16px', marginRight: '5px' }}>R$</span>
                                        {parseFloat(orcamento.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px', textAlign: 'center' }}>
                    <div style={{ width: '100%', height: '1px', backgroundColor: '#F3F4F6', marginBottom: '20px' }}></div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '2px' }}>RB PRINTINGS</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
