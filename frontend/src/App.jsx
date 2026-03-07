import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ==========================================
// IMPORTAÇÕES DE PÁGINAS ATIVAS
// ==========================================
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Orcamentos from './pages/orcamentos/Orcamentos';
import Impressoes from './pages/impressoes/Impressoes';
import EstoqueProdutos from './pages/estoque-produtos/EstoqueProdutos';
import EstoqueMateriais from './pages/estoque-materiais/EstoqueMateriais';
import CalculadoraPrecificacao from './pages/calculadora/CalculadoraPrecificacao';
import Relatorios from './pages/relatorios/Relatorios';
import Configuracoes from './pages/configuracoes/Configuracoes';
import Clientes from './pages/clientes/Clientes';
import CatalogoProdutos from './pages/impressoes/CatalogoProdutos';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ROTA PÚBLICA */}
        <Route path="/" element={<Login />} />

        {/* ROTAS PRIVADAS DO SISTEMA */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/orcamentos" element={<ProtectedRoute><Orcamentos /></ProtectedRoute>} />
        <Route path="/impressoes" element={<ProtectedRoute><Impressoes /></ProtectedRoute>} />
        <Route path="/produtos-estoque" element={<ProtectedRoute><EstoqueProdutos /></ProtectedRoute>} />
        <Route path="/materiais-estoque" element={<ProtectedRoute><EstoqueMateriais /></ProtectedRoute>} />
        <Route path="/calculadora" element={<ProtectedRoute><CalculadoraPrecificacao /></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
        <Route path="/catalogo" element={<ProtectedRoute><CatalogoProdutos /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}
