import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Certifique-se de salvar como logo.png

export default function Sidebar({ onClose }) {

  // Função oficial recomendada pelo React Router para aplicar classes condicionalmente
  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${isActive
      ? 'bg-[#FF9B54] text-white font-bold'
      : 'text-gray-300 hover:bg-gray-700 hover:text-[#FF9B54]'
    }`;

  return (
    <aside className="w-64 bg-[#2A3240] text-white flex flex-col h-full shadow-lg transition-all duration-300">
      {/* Botão fechar (Mobile) */}
      <div className="lg:hidden absolute top-4 right-4">
        <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Área da Logo / Nome do Sistema */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-gray-700 gap-3">
        <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
        <h1 className="text-xl font-extrabold tracking-wider">
          <span className="text-[#FF9B54]">RB</span> PRINTINGS
        </h1>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavLink to="/home" className={navLinkClasses} onClick={onClose}>
          Dashboard
        </NavLink>

        <NavLink to="/impressoes" className={navLinkClasses} onClick={onClose}>
          Impressões
        </NavLink>

        <NavLink to="/orcamentos" className={navLinkClasses} onClick={onClose}>
          Orçamentos
        </NavLink>

        <NavLink to="/clientes" className={navLinkClasses} onClick={onClose}>
          Clientes
        </NavLink>

        <NavLink to="/catalogo" className={navLinkClasses} onClick={onClose}>
          Catálogo de Modelos
        </NavLink>

        <NavLink to="/relatorios" className={navLinkClasses} onClick={onClose}>
          Relatórios
        </NavLink>

        <NavLink to="/produtos-estoque" className={navLinkClasses} onClick={onClose}>
          Estoque Produtos
        </NavLink>

        <NavLink to="/materiais-estoque" className={navLinkClasses} onClick={onClose}>
          Estoque Materiais
        </NavLink>
        <NavLink to="/calculadora" className={navLinkClasses} onClick={onClose}>
          Calculadora
        </NavLink>
      </nav>

      {/* Rodapé do Menu (Opcional, para Configurações ou Perfil) */}
      <div className="p-4 border-t border-gray-700">
        <NavLink to="/configuracoes" className={navLinkClasses} onClick={onClose}>
          Configurações
        </NavLink>
      </div>
    </aside>
  );
}