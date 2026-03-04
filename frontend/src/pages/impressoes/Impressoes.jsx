import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaImpressoes from './components/TabelaImpressoes';

export default function Impressoes() {
  const [fila, setFila] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* ====================================================================
    BLOCO FETCH COMENTADO - INTEGRAÇÃO FUTURA COM PHP
    ====================================================================
    const carregarImpressoes = async () => {
      try {
        const response = await fetch('http://localhost/api/impressoes.php');
        const data = await response.json();
        if (data.sucesso) {
          setFila(data.fila);
          setHistorico(data.historico);
        }
      } catch (error) {
        console.error('Erro ao buscar impressões:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarImpressoes();
    ==================================================================== */

    // Mock de dados da produção (Fila e Histórico)
    setTimeout(() => {
      setFila([
        { id: 1, maquina: 'Ender 3 V2 (A)', arquivo: 'suporte_headset_v2.gcode', pedidoId: 'PD-1042', material: 'PLA Preto', tempo: '4h 30m', progresso: 75, status: 'Imprimindo' },
        { id: 2, maquina: 'Anycubic Mono (R1)', arquivo: 'miniatura_dragao.ctb', pedidoId: 'PD-1045', material: 'Resina Cinza', tempo: '2h 15m', progresso: 10, status: 'Imprimindo' },
        { id: 3, maquina: 'Ender 3 S1 (B)', arquivo: 'case_teclado_base.gcode', pedidoId: 'PD-1046', material: 'PETG Branco', tempo: '12h 00m', progresso: 0, status: 'Na Fila' },
        { id: 4, maquina: 'Aguardando...', arquivo: 'engrenagem_reposicao.gcode', pedidoId: 'PD-1047', material: 'ABS Preto', tempo: '1h 45m', progresso: 0, status: 'Fatiando' }
      ]);
      
      setHistorico([
        { id: 101, maquina: 'Ender 3 V2 (A)', arquivo: 'vaso_decorativo_lowpoly.gcode', pedidoId: 'PD-1030', material: 'PLA Silk Bronze', tempo: '8h 20m', status: 'Concluído' },
        { id: 102, maquina: 'Ender 3 S1 (B)', arquivo: 'suporte_celular.gcode', pedidoId: 'PD-1031', material: 'PLA Branco', tempo: '1h 10m', status: 'Falha' },
        { id: 103, maquina: 'Anycubic Mono (R1)', arquivo: 'peca_xadrez_rei.ctb', pedidoId: 'PD-1032', material: 'Resina Transparente', tempo: '3h 05m', status: 'Concluído' }
      ]);
      
      setLoading(false);
    }, 800);
  }, []);

  return (
    <Layout>
      {/* Cabeçalho com o botão de Nova Impressão */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">
            Gestão de Impressões
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Controle a fila de produção e o status das suas máquinas.
          </p>
        </div>
        
        <button 
          className="bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          onClick={() => console.log('Abrir modal de Enfileirar Nova Impressão')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nova Impressão
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Sincronizando com as máquinas...</div>
      ) : (
        <>
          {/* Tabela de Fila de Produção (Ativas e Pendentes) */}
          <TabelaImpressoes 
            titulo="Fila de Produção (Ativa)" 
            dados={fila} 
            isHistorico={false} 
          />

          {/* Tabela de Histórico de Impressões */}
          <TabelaImpressoes 
            titulo="Histórico de Impressões" 
            dados={historico} 
            isHistorico={true} 
          />
        </>
      )}
    </Layout>
  );
}