import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin"}');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        {/* Botão Hambúrguer (Mobile) */}
        <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <div className="text-[#2A3240] font-bold text-sm md:text-base truncate max-w-[150px] sm:max-w-none">
            <span className="hidden sm:inline">Painel Administrativo - </span>RB PRINTINGS
        </div>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="flex items-center space-x-2 md:space-x-3">
            <span className="text-xs md:text-sm text-gray-600 font-bold hidden xs:inline">{user.name}</span>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-orange-100 text-[#FF9B54] border border-orange-200 flex items-center justify-center font-black text-xs md:text-sm">
            {user.name.charAt(0).toUpperCase()}
            </div>
        </div>

        <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Sair do sistema"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        </button>
      </div>
    </header>
  );
}