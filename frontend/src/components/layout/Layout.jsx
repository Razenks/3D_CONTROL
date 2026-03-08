import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* Sidebar para DESKTOP (Sempre visível em telas grandes) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64">
          <Sidebar onClose={() => {}} />
        </div>
      </div>

      {/* Sidebar para MOBILE (Drawer com overlay) */}
      <div 
        className={`fixed inset-0 flex z-40 lg:hidden transition-opacity duration-300 ease-linear ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay escuro */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Menu deslizante */}
        <div 
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-[#2A3240] transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Conteúdo dinâmico */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>

        <Footer />

      </div>
    </div>
  );
}