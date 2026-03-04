import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

// A propriedade 'children' representa o conteúdo da página que será injetado aqui
export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Menu Lateral Fixo */}
      <Sidebar />

      {/* Área Principal (Header + Conteúdo Dinâmico + Footer) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <Header />

        {/* Conteúdo dinâmico da página (scrollável) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>

        <Footer />
        
      </div>
    </div>
  );
}