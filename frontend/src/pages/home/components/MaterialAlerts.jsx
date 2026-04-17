import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MaterialAlerts({ alertas }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 h-full transition-colors duration-300">
      <h3 className="text-lg font-bold text-[#2A3240] dark:text-white mb-4 border-b dark:border-gray-800 pb-2">
        Alertas de Estoque
      </h3>

      {alertas.length > 0 ? (
        <ul className="space-y-3">
          {alertas.map((item) => (
            <li key={item.id} className={`flex justify-between items-center p-3 rounded-lg ${
              item.status === 'Crítico' 
                ? 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20' 
                : 'bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {item.hex && (
                  <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700 flex-shrink-0" style={{ backgroundColor: item.hex }}></div>
                )}
                <div>
                  <p className="font-semibold text-[#2A3240] dark:text-gray-200 text-sm">{item.material}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">
                    Restante: {item.restando} | Mín: {item.minimo}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-black rounded-full uppercase ${
                item.status === 'Crítico'
                  ? 'bg-red-500 text-white animate-pulse shadow-sm shadow-red-500/50'
                  : 'bg-yellow-400 dark:bg-yellow-500/20 text-yellow-900 dark:text-yellow-400'
              }`}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm italic">
          Nenhum alerta no momento.
        </div>
      )}

      <button
        onClick={() => navigate('/materiais-estoque')}
        className="mt-4 w-full text-sm text-[#FF9B54] font-bold hover:text-orange-500 transition-colors text-center uppercase tracking-widest"
      >
        Ver todo o estoque &rarr;
      </button>
    </div>
  );
}
