import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalArquivosImpressora({ isOpen, onClose, printerId, printerName }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/impressoras/${printerId}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Construímos a URL para o nosso próprio backend servir a imagem
        const filesWithUrls = data.map(f => ({
            ...f,
            thumbUrl: f.thumbnail ? `${API_BASE_URL}/api/impressoras/${printerId}/proxy-image?path=${encodeURIComponent(f.thumbnail)}` : null
        }));
        setFiles(filesWithUrls);
      }
    } catch (err) {
      console.error('Erro ao buscar arquivos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPrint = async (filename) => {
    if (!window.confirm(`Deseja iniciar a impressão do arquivo "${filename}" agora?`)) return;

    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/impressoras/${printerId}/start-print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ filename })
      });

      if (response.ok) {
        alert('Comando enviado! A impressora iniciará o aquecimento.');
        onClose();
      } else {
        const errorData = await response.json();
        alert('Erro ao iniciar: ' + (errorData.error || 'A máquina recusou o comando.'));
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  useEffect(() => {
    if (isOpen) fetchFiles();
  }, [isOpen, printerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#2A3240] text-white">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Arquivos na Memória</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{printerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-0 max-h-[60vh] overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-black animate-pulse uppercase tracking-widest">Acessando disco da K1...</div>
          ) : files.length > 0 ? (
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-white transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail da Impressora */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        {file.thumbUrl ? (
                            <img src={file.thumbUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#FF9B54]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    
                    <div>
                      <p className="font-bold text-gray-800 break-all text-sm md:text-base">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase flex gap-3 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{file.size}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{file.modified}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartPrint(file.name)}
                    className="ml-4 p-3 bg-green-100 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title="Imprimir este arquivo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 italic font-medium">Nenhum arquivo G-code encontrado.</div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black rounded-xl transition-all uppercase text-xs tracking-widest"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
