import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const loginTime = localStorage.getItem('login_time');
  
  useEffect(() => {
    if (token && loginTime) {
      const oneHour = 60 * 60 * 1000;
      const now = new Date().getTime();
      
      if (now - parseInt(loginTime) > oneHour) {
        // Sessão expirada (1 hora)
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('login_time');
        navigate('/');
      }
    }
  }, [token, loginTime, navigate]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
