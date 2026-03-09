import React, { useState } from 'react';
import API_BASE_URL from '../../../config';

export default function ModalGerenciarImpressao({ isOpen, onClose, impressao, onSucesso }) {
  const [loading, setLoading] = useState(false);
  const [showFalhaForm, setShowFalhaForm] = useState(false);
  const [showFinalizarParcial, setShowFinalizarParcial] = useState(false);
  const [pesoPerdido, setPesoPerdido] = useState('');
  const [qtdFinalizar, setQtdFinalizar] = useState(1);

  const handleStatusChange = async (novoStatus, extraData = {}) => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const body = { status: novoStatus, ...extraData };
      
      const response = await fetch(`${API_BASE_URL}/api/impressoes/${impressao.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onSucesso();
        onClose();
        resetForms();
      } else {
        const err = await response.json();
        alert(err.message || 'Erro na operação');
      }
    } catch (err) {
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!confirm('Deseja realmente remover esta impressão da fila?')) return;
    
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
        const res = await fetch(`${API_BASE_URL}/api/impressoes/${impressao.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            onSucesso();
            onClose();
        }
    } catch (err) { alert('Erro ao excluir'); }
    finally { setLoading(false); }
  };

  const resetForms = () => {
    setShowFalhaForm(false);
    setShowFinalizarParcial(false);
    setPesoPerdido('');
    setQtdFinalizar(1);
  };

  if (!isOpen || !impressao) return null;

  const restante = impressao.quantidade - (impressao.quantidade_concluida || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-8 ${showFalhaForm ? 'border-red-500' : 'border-[#2A3240]'} transition-all duration-300`}>
        <div className="p-6 border-b border-gray-100 bg-[#2A3240] text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Gerenciar Produção</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <p className="text-2xl font-black text-[#2A3240]">{impressao.projeto_nome}</p>
            <div className="mt-2 flex justify-center items-center gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                    Lote: {impressao.quantidade} un
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full text-xs font-bold text-green-600">
                    Prontos: {impressao.quantidade_concluida || 0} un
                </span>
            </div>
          </div>

          {!showFalhaForm && !showFinalizarParcial && (
            <div className="space-y-3">
              <button
                disabled={loading || restante <= 0}
                onClick={() => setShowFinalizarParcial(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                Finalizar Unidades
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                    disabled={loading}
                    onClick={() => setShowFalhaForm(true)}
                    className="bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-all uppercase text-[10px] tracking-widest"
                >
                    Relatar Falha
                </button>
                <button
                    disabled={loading}
                    onClick={handleExcluir}
                    className="bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all uppercase text-[10px] tracking-widest"
                >
                    Excluir Fila
                </button>
              </div>
            </div>
          )}

          {showFinalizarParcial && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <label className="block text-xs font-black text-green-600 uppercase mb-2">Quantas unidades ficaram prontas?</label>
                    <div className="flex items-center justify-center gap-4">
                        <button 
                            type="button" 
                            onClick={() => setQtdFinalizar(Math.max(1, qtdFinalizar - 1))}
                            className="w-10 h-10 rounded-full bg-white border border-green-200 font-bold text-green-600 shadow-sm"
                        >-</button>
                        <span className="text-3xl font-black text-[#2A3240] w-16">{qtdFinalizar}</span>
                        <button 
                            type="button" 
                            onClick={() => setQtdFinalizar(Math.min(restante, qtdFinalizar + 1))}
                            className="w-10 h-10 rounded-full bg-white border border-green-200 font-bold text-green-600 shadow-sm"
                        >+</button>
                    </div>
                    <p className="text-[10px] text-green-500 mt-3 font-bold">Máximo pendente: {restante} un</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowFinalizarParcial(false)} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-xs uppercase text-gray-500">Voltar</button>
                    <button 
                        onClick={() => handleStatusChange(restante === qtdFinalizar ? 'concluido' : 'imprimindo', { increment_qty: qtdFinalizar })}
                        className="flex-2 bg-green-600 text-white py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
          )}

          {showFalhaForm && (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <label className="block text-xs font-black text-red-600 uppercase mb-2">Peso perdido na falha (g)</label>
                <input
                  type="number"
                  autoFocus
                  placeholder="Ex: 50"
                  value={pesoPerdido}
                  onChange={(e) => setPesoPerdido(e.target.value)}
                  className="w-full px-4 py-3 border border-red-200 rounded-lg outline-none font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowFalhaForm(false)} className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl text-[10px] uppercase">Voltar</button>
                <button
                  disabled={loading}
                  onClick={() => handleStatusChange('falha', { peso_perdido: parseFloat(pesoPerdido) || 0 })}
                  className="flex-2 bg-red-600 text-white font-black py-3 px-6 rounded-xl shadow-lg uppercase text-xs tracking-widest"
                >
                  Confirmar Falha
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
