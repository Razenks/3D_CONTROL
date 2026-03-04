import React from 'react';

export default function MaterialAlerts() {
  // Mock de dados - no futuro, isso virá do seu backend (ex: /api/materiais/alertas)
  const alertas = [
    { id: 1, material: 'PLA Preto (Sunlu)', restando: '150g', status: 'Crítico' },
    { id: 2, material: 'PETG Transparente', restando: '300g', status: 'Atenção' },
    { id: 3, material: 'Resina Lavável Cinza', restando: '200ml', status: 'Crítico' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-[#2A3240] mb-4 border-b pb-2">
        Alertas de Estoque
      </h3>
      <ul className="space-y-3">
        {alertas.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-[#2A3240] text-sm">{item.material}</p>
              <p className="text-xs text-gray-500">Restante: {item.restando}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              item.status === 'Crítico' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {item.status}
            </span>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full text-sm text-[#FF9B54] font-bold hover:text-orange-500 transition-colors text-center">
        Ver todo o estoque &rarr;
      </button>
    </div>
  );
}