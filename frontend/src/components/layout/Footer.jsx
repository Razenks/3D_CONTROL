import React from 'react';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
      &copy; {anoAtual} Sistema de Impressão 3D. Todos os direitos reservados.
    </footer>
  );
}