import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ==========================================
// IMPORTAÇÕES DE PÁGINAS ATIVAS
// ==========================================
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Orcamentos from './pages/orcamentos/Orcamentos';
import Impressoes from './pages/impressoes/Impressoes';
import CalculadoraPrecificacao from './pages/calculadora/CalculadoraPrecificacao';
import EstoqueProdutos from './pages/estoque-produtos/EstoqueProdutos';
import EstoqueMateriais from './pages/estoque-materiais/EstoqueMateriais';

// ==========================================
// IMPORTAÇÕES FUTURAS (Aguardando criação)
// ==========================================
// import Estoque from './pages/estoque/Estoque';

// import Relatorios from './pages/relatorios/Relatorios';

// Nota de Arquitetura: Quando formos ativar as rotas abaixo, 
// poderemos importar o componente <Layout> que criamos para 
// envolver essas páginas privadas, mantendo o Sidebar e o Header.

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ROTA PÚBLICA */}
        <Route path="/" element={<Login />} />

        {/* ROTAS PRIVADAS DO SISTEMA (Comentadas) */}
        <Route path="/home" element={<Home />} />
        <Route path="/orcamentos" element={<Orcamentos />} />
        <Route path="/impressoes" element={<Impressoes />} />
        <Route path="/produtos-estoque" element={<EstoqueProdutos />} />
        <Route path="/materiais-estoque" element={<EstoqueMateriais />} />
        <Route path="/calculadora" element={<CalculadoraPrecificacao />} />
        {/*
        <Route path="/relatorios" element={<Relatorios />} />
        */}

      </Routes>
    </Router>
  );
}