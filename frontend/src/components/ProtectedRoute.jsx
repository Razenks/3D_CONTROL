import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const loginTime = localStorage.getItem('login_time');
  
  useEffect(() => {
    if (token) {
      // Em vez de expirar em 1 hora, vamos apenas atualizar o tempo de atividade
      // para que a sessão se mantenha enquanto o usuário estiver navegando.
      localStorage.setItem('login_time', new Date().getTime().toString());
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
