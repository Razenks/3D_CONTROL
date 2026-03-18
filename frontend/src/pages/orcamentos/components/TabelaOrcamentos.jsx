import React, { useState } from 'react';
import ModalVerOrcamento from './ModalVerOrcamento';
import ModalAnalisarOrcamento from './ModalAnalisarOrcamento';
import ModeloOrcamentoCliente from './ModeloOrcamentoCliente';
import { useNavigate } from 'react-router-dom';

export default function TabelaOrcamentos({ titulo, dados, isHistorico = false, onRefresh }) {
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [isModalVerOpen, setIsModalVerOpen] = useState(false);
  const [isModalAnalisarOpen, setIsModalAnalisarOpen] = useState(false);
  const [isModeloClienteOpen, setIsModeloClienteOpen] = useState(false);
  const navigate = useNavigate();

  // Função auxiliar para definir a cor do badge de status
  const getStatusEstilo = (status) => {
    switch (status) {
      case 'Aguardando Análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Precificando':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleModeloCliente = (orc) => {
    setOrcamentoSelecionado(orc);
    setIsModeloClienteOpen(true);
  };

  const handleImprimir = (orc) => {
    navigate('/impressoes');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-[#2A3240]">{titulo}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-white border-b border-gray-200">
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Cliente / Projeto</th>
              <th className="px-6 py-3 font-semibold">Data</th>
              <th className="px-6 py-3 font-semibold">Valor</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {dados.length > 0 ? (
              dados.map((orcamento) => (
                <tr key={orcamento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#2A3240]">ORC-{orcamento.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2A3240]">
                      {orcamento.cliente_rel ? orcamento.cliente_rel.nome : (orcamento.cliente || 'Consumidor Final')}
                    </div>
                    <div className="text-gray-500 text-xs">{orcamento.projeto}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatarData(orcamento.created_at)}</td>
                  
                  <td className="px-6 py-4 font-medium text-[#2A3240]">
                    R$ {parseFloat(orcamento.valor_total).toFixed(2).replace('.', ',')}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusEstilo(orcamento.status)}`}>
                      {orcamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                    <button 
                      onClick={() => handleVer(orcamento)}
                      className="text-[#2A3240] hover:text-[#FF9B54] font-semibold text-xs transition-colors"
                    >
                      Ver
                    </button>
                    
                    <button 
                      onClick={() => handleModeloCliente(orcamento)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase transition-colors px-2"
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
                        className="bg-[#2A3240] hover:bg-gray-800 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors uppercase"
                      >
                        Analisar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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

      <ModeloOrcamentoCliente 
        isOpen={isModeloClienteOpen}
        onClose={() => setIsModeloClienteOpen(false)}
        orcamento={orcamentoSelecionado}
      />
    </div>
  );
}
