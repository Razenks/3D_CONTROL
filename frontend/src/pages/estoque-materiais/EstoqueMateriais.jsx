import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaMateriais from './components/TabelaMateriais';
import ModalNovoMaterial from './components/ModalNovoMaterial';
import ModalEditarMaterial from './components/ModalEditarMaterial';
import ModalRegistrarCompra from './components/ModalRegistrarCompra';
import API_BASE_URL from '../../config';

export default function EstoqueMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompraModalOpen, setIsCompraModalOpen] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] = useState(null);

  const fetchMateriais = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/materiais`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setMateriais(await response.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMateriais(); }, []);

  const handleSalvarNovo = async (dados) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/materiais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dados)
      });
      if (response.ok) fetchMateriais();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (mat) => {
    setMaterialSelecionado(mat);
    setIsEditModalOpen(true);
  };

  const handleCompra = (mat) => {
    setMaterialSelecionado(mat);
    setIsCompraModalOpen(true);
  };

  // Calcular alertas
  const materiaisAtivos = materiais.filter(m => m.ativo);
  const criticos = materiaisAtivos.filter(m => parseFloat(m.quantidade_restante) <= parseFloat(m.estoque_minimo || 200) / 2);
  const baixos = materiaisAtivos.filter(m => {
    const rest = parseFloat(m.quantidade_restante);
    const min = parseFloat(m.estoque_minimo || 200);
    return rest > min / 2 && rest <= min;
  });
  const totalAlertas = criticos.length + baixos.length;

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1a1f2e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] dark:text-white uppercase tracking-tighter">Estoque de Materiais</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Controle seu nível de filamentos e resinas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#2A3240] dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest">+ Novo Material</button>
      </div>

      {/* Banner de alertas */}
      {totalAlertas > 0 && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-4 transition-colors ${
          criticos.length > 0 ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            criticos.length > 0 ? 'bg-red-500' : 'bg-yellow-500'
          }`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-black uppercase ${criticos.length > 0 ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
              {totalAlertas} {totalAlertas === 1 ? 'material' : 'materiais'} com estoque abaixo do mínimo
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {criticos.map(m => (
                <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold border border-red-200 dark:border-red-500/20">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  {m.tipo} ({m.cor?.nome || 'S/C'}) - {m.quantidade_restante}{m.unidade}
                </span>
              ))}
              {baixos.map(m => (
                <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs font-bold border border-yellow-200 dark:border-yellow-500/20">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {m.tipo} ({m.cor?.nome || 'S/C'}) - {m.quantidade_restante}{m.unidade}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <TabelaMateriais materiais={materiais} loading={loading} onRefresh={fetchMateriais} onEdit={handleEdit} onCompra={handleCompra} />

      <ModalNovoMaterial isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSalvar={handleSalvarNovo} />
      <ModalEditarMaterial isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} material={materialSelecionado} onSucesso={fetchMateriais} />
      <ModalRegistrarCompra isOpen={isCompraModalOpen} onClose={() => setIsCompraModalOpen(false)} material={materialSelecionado} onSucesso={fetchMateriais} />
    </Layout>
  );
}
