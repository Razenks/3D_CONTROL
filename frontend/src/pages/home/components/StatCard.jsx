import React from 'react';

export default function StatCard({ titulo, valor, descricao, alerta = false }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderColor: alerta ? '#EF4444' : '#FF9B54' }}>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {titulo}
      </h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[#2A3240]">
          {valor}
        </span>
      </div>
      <p className={`mt-2 text-sm ${alerta ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
        {descricao}
      </p>
    </div>
  );
}