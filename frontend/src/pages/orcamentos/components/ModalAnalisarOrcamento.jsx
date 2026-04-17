import React, { useState } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalAnalisarOrcamento({ isOpen, onClose, orcamento, onSucesso }) {
  const [loading, setLoading] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [exibirCampoRejeicao, setExibirCampoRejeicao] = useState(false);

  const handleStatusChange = async (novoStatus) => {
    if (novoStatus === 'Rejeitado' && !exibirCampoRejeicao) {
        setExibirCampoRejeicao(true);
        return;
    }

    if (novoStatus === 'Rejeitado' && !motivoRejeicao.trim()) {
        alert('Por favor, informe o motivo da rejeição.');
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
            status: novoStatus,
            motivo_rejeicao: novoStatus === 'Rejeitado' ? motivoRejeicao : null
        })
      });

      if (response.ok) {
        onSucesso();
        onClose();
        setMotivoRejeicao('');
        setExibirCampoRejeicao(false);
      } else {
        alert('Erro ao atualizar status do orçamento.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !orcamento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-[#2A3240] text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tighter">Analisar Orçamento</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PROJETO</p>
            <p className="text-lg font-bold text-[#2A3240] dark:text-white leading-tight">{orcamento.projeto}</p>
            <p className="text-[#FF9B54] font-black text-3xl mt-2">R$ {parseFloat(orcamento.valor_total).toFixed(2)}</p>
          </div>

          {exibirCampoRejeicao && (
            <div className="mb-6 animate-in slide-in-from-top duration-300">
                <label className="block text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Motivo da Rejeição</label>
                <textarea
                    autoFocus
                    value={motivoRejeicao}
                    onChange={(e) => setMotivoRejeicao(e.target.value)}
                    placeholder="Ex: Valor muito alto ou prazo indisponível..."
                    className="w-full px-4 py-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-xl outline-none font-bold text-[#2A3240] dark:text-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 transition-all"
                    rows="3"
                ></textarea>
            </div>
          )}

          <div className="space-y-3">
            {!exibirCampoRejeicao && (
                <button
                    disabled={loading}
                    onClick={() => handleStatusChange('Aprovado')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-green-500/20 transition-all"
                >Aprovar Orçamento</button>
            )}

            <button
              disabled={loading}
              onClick={() => handleStatusChange('Rejeitado')}
              className={`w-full ${exibirCampoRejeicao ? 'bg-red-600' : 'bg-red-500'} hover:bg-red-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 transition-all`}
            >{exibirCampoRejeicao ? 'Confirmar Rejeição' : 'Rejeitar Orçamento'}</button>

            <button onClick={() => exibirCampoRejeicao ? setExibirCampoRejeicao(false) : onClose()} className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              {exibirCampoRejeicao ? 'Voltar' : 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
