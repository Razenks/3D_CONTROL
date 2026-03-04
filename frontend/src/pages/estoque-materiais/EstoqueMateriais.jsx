import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import TabelaMateriais from './components/TabelaMateriais';
import ModalNovoMaterial from './components/ModalNovoMaterial';

export default function EstoqueMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lógica para salvar o novo material no estado (futuramente via PHP)
  const handleSalvarMaterial = (novoMaterialForm) => {
    const materialFormatado = {
      id: Date.now(),
      tipo: novoMaterialForm.tipo,
      marca: novoMaterialForm.marca,
      cor: novoMaterialForm.cor,
      hexCor: novoMaterialForm.hexCor,
      custoUnidade: parseFloat(novoMaterialForm.custoKG),
      quantidadeRestante: parseFloat(novoMaterialForm.quantidadeInicial),
      unidade: novoMaterialForm.unidade
    };

    setMateriais([materialFormatado, ...materiais]);
    console.log("Material adicionado com sucesso!", materialFormatado);
  };

  useEffect(() => {
    // Mock inicial de dados (visto na resposta anterior)
    setTimeout(() => {
      setMateriais([
        { id: 1, tipo: 'PLA', marca: 'Sunlu', cor: 'Preto', hexCor: '#000000', custoUnidade: 115.00, quantidadeRestante: 850, unidade: 'g' },
        { id: 2, tipo: 'PETG', marca: 'Voolt3D', cor: 'Branco', hexCor: '#FFFFFF', custoUnidade: 95.00, quantidadeRestante: 350, unidade: 'g' },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A3240]">Estoque de Materiais</h2>
          <p className="text-sm text-gray-600 mt-1">Gerencie seus carretéis e galões de resina.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF9B54] hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Material
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Sincronizando estoque...</div>
      ) : (
        <TabelaMateriais materiais={materiais} />
      )}

      {/* Chamada do Modal */}
      <ModalNovoMaterial 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSalvar={handleSalvarMaterial} 
      />
    </Layout>
  );
}