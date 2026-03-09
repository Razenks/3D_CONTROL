import React, { useState, useEffect } from 'react';
import ModalArquivosImpressora from './ModalArquivosImpressora';
import API_BASE_URL from '../../../config';

export default function LivePrintStatus({ printerId, printerName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalArquivosOpen, setIsModalArquivosOpen] = useState(false);

  const fetchStatus = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/impressoras/${printerId}/current-print`, {
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
      console.error('Erro ao buscar status live:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, [printerId]);

  // Lógica de impressão
  const isPrinting = data?.status === 'printing' || (data?.progresso > 0 && data?.progresso < 100);

  return (
    <>
    <div className="bg-[#2A3240] text-white p-6 rounded-2xl shadow-xl mb-8 border-l-8 border-[#FF9B54] animate-in slide-in-from-top duration-500 relative overflow-hidden">
      
      {/* Background Decorativo sutil */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>

      <div className="flex flex-col gap-6">
        {/* LINHA 1: Cabeçalho e Botão de Arquivos (SEMPRE VISÍVEIS) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPrinting ? 'bg-orange-400' : 'bg-green-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPrinting ? 'bg-orange-500' : 'bg-green-500'}`}></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {isPrinting ? 'Impressão em Curso' : 'Máquina Pronta'}
              </span>
            </div>
            <h3 className="text-xl font-black truncate max-w-md">
              {isPrinting ? (data?.filename || 'Imprimindo...') : 'Aguardando Trabalho'}
            </h3>
            <p className="text-sm text-gray-400 font-medium italic">{printerName}</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsModalArquivosOpen(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-black py-2.5 px-5 rounded-xl transition-all uppercase text-[10px] tracking-widest flex items-center gap-2 border border-gray-600 shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF9B54]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1m-6 9a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Arquivos na Memória
            </button>
          </div>
        </div>

        {/* LINHA 2: Status Técnico (Temperaturas e Progresso) */}
        <div className="flex flex-wrap items-center gap-4 md:gap-10 py-4 border-t border-gray-700/50">
          <div className="flex items-center gap-8">
            <div className="text-center">
                <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">Extrusora</span>
                <span className="text-xl font-black">{data?.temp_extrusora || 0}°C</span>
            </div>
            <div className="text-center">
                <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">Mesa</span>
                <span className="text-xl font-black">{data?.temp_mesa || 0}°C</span>
            </div>
          </div>

          {isPrinting && (
            <div className="flex-1 flex flex-col md:flex-row items-center gap-4 min-w-[200px]">
                <div className="text-center md:text-left">
                    <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">Progresso</span>
                    <span className="text-2xl font-black text-[#FF9B54] leading-none">{data?.progresso}%</span>
                </div>
                <div className="flex-1 w-full bg-gray-800 h-4 rounded-full overflow-hidden p-1 border border-gray-700">
                    <div 
                        className="bg-[#FF9B54] h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,155,84,0.4)]"
                        style={{ width: `${data?.progresso}%` }}
                    ></div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <ModalArquivosImpressora 
        isOpen={isModalArquivosOpen}
        onClose={() => setIsModalArquivosOpen(false)}
        printerId={printerId}
        printerName={printerName}
    />
    </>
  );
}

