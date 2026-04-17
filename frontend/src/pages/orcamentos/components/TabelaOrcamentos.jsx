import React, { useState } from 'react';
import ModalVerOrcamento from './ModalVerOrcamento';
import ModalAnalisarOrcamento from './ModalAnalisarOrcamento';
import ModalEditarOrcamento from './ModalEditarOrcamento';
import ModeloOrcamentoCliente from './ModeloOrcamentoCliente';
import { useNavigate } from 'react-router-dom';

export default function TabelaOrcamentos({ titulo, dados, isHistorico = false, onRefresh }) {
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [isModalVerOpen, setIsModalVerOpen] = useState(false);
  const [isModalAnalisarOpen, setIsModalAnalisarOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [isModeloClienteOpen, setIsModeloClienteOpen] = useState(false);
  const navigate = useNavigate();

  // Função auxiliar para definir a cor do badge de status
  const getStatusEstilo = (status) => {
    switch (status) {
      case 'Aguardando Análise':
        return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
      case 'Precificando':
        return 'bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'Aprovado':
        return 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'Rejeitado':
        return 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20';
      default:
        return 'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
    }
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const handleVer = (orc) => {
    setOrcamentoSelecionado(orc);
    setIsModalVerOpen(true);
  };

  const handleAnalisar = (orc) => {
    setOrcamentoSelecionado(orc);
    setIsModalAnalisarOpen(true);
  };

  const handleEditar = (orc) => {
    setOrcamentoSelecionado(orc);
    setIsModalEditarOpen(true);
  };

  const handleModeloCliente = (orc) => {
    setOrcamentoSelecionado(orc);
    setIsModeloClienteOpen(true);
  };

  const handleImprimir = (orc) => {
    navigate('/impressoes');
  };

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/20">
        <h3 className="text-lg font-bold text-[#2A3240] dark:text-white">{titulo}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">ID</th>
              <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">Cliente / Projeto</th>
              <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">Data</th>
              <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">Valor</th>
              <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">Status</th>
              <th className="px-6 py-3 font-semibold text-right uppercase text-[10px] tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
            {dados.length > 0 ? (
              dados.map((orcamento) => (
                <tr key={orcamento.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#2A3240] dark:text-gray-200">ORC-{orcamento.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2A3240] dark:text-gray-200">
                      {orcamento.cliente_rel ? orcamento.cliente_rel.nome : (orcamento.cliente || 'Consumidor Final')}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{orcamento.projeto}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatarData(orcamento.created_at)}</td>
                  
                  <td className="px-6 py-4 font-black text-[#2A3240] dark:text-[#FF9B54]">
                    R$ {parseFloat(orcamento.valor_total).toFixed(2).replace('.', ',')}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusEstilo(orcamento.status)}`}>
                      {orcamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                    <button 
                      onClick={() => handleVer(orcamento)}
                      className="text-[#2A3240] dark:text-gray-300 hover:text-[#FF9B54] font-bold text-xs transition-colors"
                    >
                      Ver
                    </button>

                    {!isHistorico && orcamento.status !== 'Aprovado' && orcamento.status !== 'Rejeitado' && (
                      <button 
                        onClick={() => handleEditar(orcamento)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-bold text-xs transition-colors px-2"
                      >
                        Editar
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleModeloCliente(orcamento)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-bold text-[10px] uppercase transition-colors px-2"
                      title="Gerar PDF para enviar ao cliente"
                    >
                      PDF Cliente
                    </button>

                    {orcamento.status === 'Aprovado' && (
                      <button 
                        onClick={() => handleImprimir(orcamento)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors uppercase"
                        title="Adicionar na fila de impressão"
                      >
                        Imprimir
                      </button>
                    )}

                    {!isHistorico && orcamento.status !== 'Aprovado' && orcamento.status !== 'Rejeitado' && (
                      <button 
                        onClick={() => handleAnalisar(orcamento)}
                        className="bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors uppercase shadow-sm"
                      >
                        Analisar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">
                  Nenhum orçamento encontrado nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalVerOrcamento 
        isOpen={isModalVerOpen} 
        onClose={() => setIsModalVerOpen(false)} 
        orcamento={orcamentoSelecionado} 
      />

      <ModalAnalisarOrcamento 
        isOpen={isModalAnalisarOpen} 
        onClose={() => setIsModalAnalisarOpen(false)} 
        orcamento={orcamentoSelecionado} 
        onSucesso={onRefresh}
      />

      <ModalEditarOrcamento
        isOpen={isModalEditarOpen}
        onClose={() => setIsModalEditarOpen(false)}
        orcamento={orcamentoSelecionado}
        onSucesso={onRefresh}
      />

      <ModeloOrcamentoCliente 
        isOpen={isModeloClienteOpen}
        onClose={() => setIsModeloClienteOpen(false)}
        orcamento={orcamentoSelecionado}
      />
    </div>
  );
}
