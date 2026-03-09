import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaMateriais from './components/TabelaMateriais';
import ModalNovoMaterial from './components/ModalNovoMaterial';
import ModalEditarMaterial from './components/ModalEditarMaterial';
import API_BASE_URL from '../../config';

export default function EstoqueMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-[#2A3240] uppercase tracking-tighter">Estoque de Materiais</h2>
          <p className="text-sm text-gray-500 font-medium">Controle seu nível de filamentos e resinas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#2A3240] hover:bg-gray-800 text-white font-black py-3 px-8 rounded-xl shadow-lg uppercase text-xs tracking-widest">+ Novo Material</button>
      </div>

      <TabelaMateriais materiais={materiais} loading={loading} onRefresh={fetchMateriais} onEdit={handleEdit} />

      <ModalNovoMaterial isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSalvar={handleSalvarNovo} />
      <ModalEditarMaterial isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} material={materialSelecionado} onSucesso={fetchMateriais} />
    </Layout>
  );
}
