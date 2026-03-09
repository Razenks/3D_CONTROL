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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 bg-[#2A3240] text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Analisar Orçamento</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">PROJETO</p>
            <p className="text-lg font-bold text-[#2A3240]">{orcamento.projeto}</p>
            <p className="text-[#FF9B54] font-extrabold text-2xl mt-2">R$ {parseFloat(orcamento.valor_total).toFixed(2)}</p>
          </div>

          {exibirCampoRejeicao && (
            <div className="mb-6 animate-in slide-in-from-top duration-300">
                <label className="block text-xs font-black text-red-500 uppercase tracking-widest mb-2">Motivo da Rejeição</label>
                <textarea
                    autoFocus
                    value={motivoRejeicao}
                    onChange={(e) => setMotivoRejeicao(e.target.value)}
                    placeholder="Ex: Valor muito alto..."
                    className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-xl outline-none font-bold text-[#2A3240] text-sm"
                    rows="3"
                ></textarea>
            </div>
          )}

          <div className="space-y-3">
            {!exibirCampoRejeicao && (
                <button
                    disabled={loading}
                    onClick={() => handleStatusChange('Aprovado')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase text-sm"
                >Aprovar Orçamento</button>
            )}

            <button
              disabled={loading}
              onClick={() => handleStatusChange('Rejeitado')}
              className={`w-full ${exibirCampoRejeicao ? 'bg-red-600' : 'bg-red-500'} hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase text-sm`}
            >{exibirCampoRejeicao ? 'Confirmar Rejeição' : 'Rejeitar Orçamento'}</button>

            <button onClick={() => exibirCampoRejeicao ? setExibirCampoRejeicao(false) : onClose()} className="w-full bg-gray-100 py-3 rounded-lg font-bold uppercase text-sm">
              {exibirCampoRejeicao ? 'Voltar' : 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
