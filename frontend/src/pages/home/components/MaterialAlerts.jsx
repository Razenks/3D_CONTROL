import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MaterialAlerts({ alertas }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-[#2A3240] mb-4 border-b pb-2">
        Alertas de Estoque
      </h3>
      
      {alertas.length > 0 ? (
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
      ) : (
        <div className="text-center py-6 text-gray-400 text-sm italic">
          Nenhum alerta crítico no momento.
        </div>
      )}

      <button 
        onClick={() => navigate('/materiais-estoque')}
        className="mt-4 w-full text-sm text-[#FF9B54] font-bold hover:text-orange-500 transition-colors text-center"
      >
        Ver todo o estoque &rarr;
      </button>
    </div>
  );
}
