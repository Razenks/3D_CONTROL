import React from 'react';

export default function Header() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-200">
      <div className="text-[#2A3240] font-semibold">
        {/* Espaço para um breadcrumb ou título dinâmico da página atual */}
        Bem-vindo ao Painel
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin</span>
        {/* Avatar ou Iniciais do Usuário */}
        <div className="w-8 h-8 rounded-full bg-[#FF9B54] text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}