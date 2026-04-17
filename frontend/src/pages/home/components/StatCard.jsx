import React from 'react';

export default function StatCard({ titulo, valor, descricao, alerta = false }) {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm p-6 border-l-4 transition-colors duration-300" style={{ borderColor: alerta ? '#EF4444' : '#FF9B54' }}>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {titulo}
      </h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[#2A3240] dark:text-white">
          {valor}
        </span>
      </div>
      <p className={`mt-2 text-sm ${alerta ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
        {descricao}
      </p>
    </div>
  );
}