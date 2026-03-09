import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ModalNovoCliente from './components/ModalNovoCliente';
import ModalEditarCliente from './components/ModalEditarCliente';
import API_BASE_URL from '../../config';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('CPF'); // Aba ativa: CPF ou CNPJ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const fetchClientes = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  // Filtragem baseada na aba ativa
  const clientesFiltrados = clientes.filter(c => (c.tipo || 'CPF') === activeTab);

  const handleToggleAtivo = async (cliente) => {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/clientes/${cliente.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ ativo: !cliente.ativo })
        });
        if (response.ok) fetchClientes();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (cliente) => {
    setClienteSelecionado(cliente);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este cliente permanentemente?')) return;
    
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/clientes/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json' 
        }
      });
      
      if (response.ok) {
        fetchClientes();
      } else {
          const errorData = await response.json();
          alert('Erro ao excluir: ' + (errorData.message || 'Verifique se o cliente possui orçamentos vinculados.'));
      }
    } catch (err) {
      alert('Erro de conexão ao excluir.');
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">
            Gestão de Clientes
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Cadastre e gerencie os contatos da RB PRINTINGS.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2A3240] hover:bg-gray-800 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest"
        >
          + Novo Cliente
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-100 pb-1">
        <button 
          onClick={() => setActiveTab('CPF')}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'CPF' ? 'border-[#FF9B54] text-[#2A3240]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Pessoas Físicas (CPF)
        </button>
        <button 
          onClick={() => setActiveTab('CNPJ')}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'CNPJ' ? 'border-[#FF9B54] text-[#2A3240]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Pessoas Jurídicas (CNPJ)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">ID / Nome</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Documento / Endereço</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 animate-pulse font-bold uppercase text-xs">Carregando...</td></tr>
              ) : clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((c) => (
                  <tr key={c.id} className={`hover:bg-gray-50/50 transition-colors ${!c.ativo ? 'opacity-40 grayscale bg-gray-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-[#2A3240] text-sm uppercase">CLI-{c.id.toString().padStart(3, '0')}</span>
                        <span className="text-gray-600 font-bold">{c.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${c.tipo === 'CNPJ' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                        {c.tipo || 'CPF'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-500">{c.email || 'S/ E-mail'}</div>
                      <div className="text-xs font-black text-[#FF9B54]">{c.telefone || 'S/ Telefone'}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-[10px] font-black text-gray-400 uppercase truncate">
                        {c.tipo === 'CNPJ' ? (c.cnpj || 'S/ CNPJ') : (c.cpf || 'S/ CPF')}
                      </div>
                      <div className="text-xs text-gray-500 italic truncate">{c.endereco || 'Endereço não informado'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        
                        <button 
                            onClick={() => handleToggleAtivo(c)} 
                            className={`${c.ativo ? 'text-gray-300 hover:text-red-500' : 'text-green-500 hover:text-green-700'} transition-colors`}
                            title={c.ativo ? 'Desativar' : 'Ativar'}
                        >
                            {c.ativo ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                        </button>

                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="text-gray-200 hover:text-black transition-colors"
                          title="Excluir Permanentemente"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic font-medium">Nenhum cliente {activeTab} cadastrado nesta aba.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalNovoCliente isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSucesso={fetchClientes} />
      <ModalEditarCliente isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} cliente={clienteSelecionado} onSucesso={fetchClientes} />
    </Layout>
  );
}
