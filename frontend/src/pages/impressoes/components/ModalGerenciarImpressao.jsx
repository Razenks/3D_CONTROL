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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className={`bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border dark:border-gray-800 border-t-8 ${showFalhaForm ? 'border-red-500' : 'border-[#2A3240] dark:border-orange-500'} transition-all duration-300`}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-[#2A3240] text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tighter">Gerenciar Produção</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-8 transition-colors duration-300">
          <div className="mb-6 text-center">
            <p className="text-2xl font-black text-[#2A3240] dark:text-white uppercase tracking-tight">{impressao.projeto_nome}</p>
            <div className="mt-4 flex justify-center items-center gap-3">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border dark:border-gray-700">
                    Lote: {impressao.quantidade} un
                </span>
                <span className="bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-xl text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest border border-green-100 dark:border-green-500/20">
                    Prontos: {impressao.quantidade_concluida || 0} un
                </span>
            </div>
          </div>

          {!showFalhaForm && !showFinalizarParcial && (
            <div className="space-y-3">
              <button
                disabled={loading || restante <= 0}
                onClick={() => setShowFinalizarParcial(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                Finalizar Unidades
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                    disabled={loading}
                    onClick={() => setShowFalhaForm(true)}
                    className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all uppercase text-[10px] tracking-widest border border-red-100 dark:border-red-500/20"
                >
                    Relatar Falha
                </button>
                <button
                    disabled={loading}
                    onClick={handleExcluir}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-[10px] tracking-widest border dark:border-gray-700"
                >
                    Excluir Fila
                </button>
              </div>
            </div>
          )}

          {showFinalizarParcial && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="bg-green-50 dark:bg-green-500/5 p-6 rounded-2xl border border-green-100 dark:border-green-500/20 text-center transition-colors">
                    <label className="block text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-4">Quantas unidades ficaram prontas?</label>
                    <div className="flex items-center justify-center gap-6">
                        <button 
                            type="button" 
                            onClick={() => setQtdFinalizar(Math.max(1, qtdFinalizar - 1))}
                            className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-green-200 dark:border-green-500/30 font-black text-2xl text-green-600 dark:text-green-400 shadow-sm hover:scale-110 active:scale-95 transition-all"
                        >-</button>
                        <span className="text-5xl font-black text-[#2A3240] dark:text-white w-20">{qtdFinalizar}</span>
                        <button 
                            type="button" 
                            onClick={() => setQtdFinalizar(Math.min(restante, qtdFinalizar + 1))}
                            className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-green-200 dark:border-green-500/30 font-black text-2xl text-green-600 dark:text-green-400 shadow-sm hover:scale-110 active:scale-95 transition-all"
                        >+</button>
                    </div>
                    <p className="text-[10px] text-green-500 dark:text-green-600 mt-4 font-bold uppercase tracking-tighter">Máximo pendente: {restante} un</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowFinalizarParcial(false)} className="flex-1 bg-gray-100 dark:bg-gray-800 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Voltar</button>
                    <button 
                        onClick={() => handleStatusChange(restante === qtdFinalizar ? 'concluido' : 'imprimindo', { increment_qty: qtdFinalizar })}
                        className="flex-[2] bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-600/20 transition-all"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
          )}

          {showFalhaForm && (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
              <div className="bg-red-50 dark:bg-red-500/5 p-6 rounded-2xl border border-red-100 dark:border-red-500/20 transition-colors">
                <label className="block text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">Peso perdido na falha (g)</label>
                <input
                  type="number"
                  autoFocus
                  placeholder="Ex: 50"
                  value={pesoPerdido}
                  onChange={(e) => setPesoPerdido(e.target.value)}
                  className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-xl outline-none font-black text-[#2A3240] dark:text-white text-xl focus:ring-4 focus:ring-red-500/10 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowFalhaForm(false)} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Voltar</button>
                <button
                  disabled={loading}
                  onClick={() => handleStatusChange('falha', { peso_perdido: parseFloat(pesoPerdido) || 0 })}
                  className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-red-600/20 uppercase text-xs tracking-widest transition-all"
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
