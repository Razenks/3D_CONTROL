import React from 'react';

export default function TabelaMateriais({ materiais }) {
  
  // Função auxiliar para definir o status baseado no peso/volume restante
  const renderStatusBadge = (quantidade, tipoUnidade) => {
    let status = 'OK';
    let corClasses = 'bg-green-100 text-green-800 border-green-200';

    // Lógica para Filamentos (gramas) ou Resina (ml)
    if (quantidade <= 200) {
      status = 'Crítico';
      corClasses = 'bg-red-100 text-red-800 border-red-200';
    } else if (quantidade <= 400) {
      status = 'Atenção';
      corClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${corClasses}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#2A3240]">Insumos (Filamentos e Resinas)</h3>
        <span className="text-sm text-gray-500 font-medium">Total de Insumos: {materiais.length}</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-white border-b border-gray-200">
              <th className="px-6 py-3 font-semibold">Material / Marca</th>
              <th className="px-6 py-3 font-semibold">Cor</th>
              <th className="px-6 py-3 font-semibold">Custo (KG/Litro)</th>
              <th className="px-6 py-3 font-semibold">Restante</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {materiais.length > 0 ? (
              materiais.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#2A3240]">{item.tipo}</div>
                    <div className="text-gray-500 text-xs">{item.marca}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" 
                        style={{ backgroundColor: item.hexCor || '#ccc' }}
                        title={item.cor}
                      ></span>
                      <span className="font-semibold text-gray-700">{item.cor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    R$ {item.custoUnidade.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-[#2A3240]">{item.quantidadeRestante}</span>
                      <span className="text-xs font-semibold text-gray-500 uppercase">{item.unidade}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {renderStatusBadge(item.quantidadeRestante, item.unidade)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#2A3240] hover:text-[#FF9B54] font-semibold text-sm transition-colors mr-4">
                      Atualizar Peso
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors">
                      Baixa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Nenhum material cadastrado no estoque.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}