import React from 'react';

export default function ReportSummaryCard({ titulo, valor, descricao, icone, cor }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {titulo}
        </h3>
        <div className={`p-2 rounded-lg ${cor || 'bg-blue-50 text-blue-500'}`}>
          {icone}
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-800">{valor}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 italic">
        {descricao}
      </p>
    </div>
  );
}
