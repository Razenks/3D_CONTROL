import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {

  // Função oficial recomendada pelo React Router para aplicar classes condicionalmente
  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${isActive
      ? 'bg-[#FF9B54] text-white font-bold'
      : 'text-gray-300 hover:bg-gray-700 hover:text-[#FF9B54]'
    }`;

  return (
    <aside className="w-64 bg-[#2A3240] text-white flex flex-col h-full shadow-lg transition-all duration-300">
      {/* Área da Logo / Nome do Sistema */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-extrabold tracking-wider">
          <span className="text-[#FF9B54]">3D</span> SYSTEM
        </h1>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavLink to="/home" className={navLinkClasses}>
          Dashboard
        </NavLink>

        <NavLink to="/impressoes" className={navLinkClasses}>
          Impressões
        </NavLink>

        <NavLink to="/orcamentos" className={navLinkClasses}>
          Orçamentos
        </NavLink>

        <NavLink to="/relatorios" className={navLinkClasses}>
          Relatórios
        </NavLink>

        <NavLink to="/produtos-estoque" className={navLinkClasses}>
          Estoque Produtos
        </NavLink>

        <NavLink to="/materiais-estoque" className={navLinkClasses}>
          Estoque Materiais
        </NavLink>
        <NavLink to="/calculadora" className={navLinkClasses}>
          Calculadora
        </NavLink>
      </nav>

      {/* Rodapé do Menu (Opcional, para Configurações ou Perfil) */}
      <div className="p-4 border-t border-gray-700">
        <NavLink to="/configuracoes" className={navLinkClasses}>
          Configurações
        </NavLink>
      </div>
    </aside>
  );
}