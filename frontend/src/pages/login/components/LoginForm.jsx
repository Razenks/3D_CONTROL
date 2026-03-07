import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginInput from './LoginInput';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    usuario: '', // No Laravel estamos usando o email por padrão
    senha: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('erro'); // 'erro' ou 'sucesso'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');
    localStorage.removeItem('login_time');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.usuario, // Mapeando usuario para email do backend
          password: formData.senha
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTipoMensagem('sucesso');
        setMensagem('Login realizado com sucesso! Redirecionando...');
        
        // Salva o token e dados do usuário no localStorage
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('login_time', new Date().getTime().toString());

        // Redireciona para a Home após 1 segundo
        setTimeout(() => {
          navigate(data.redirect_to || '/home');
        }, 1000);
      } else {
        setTipoMensagem('erro');
        setMensagem(data.message || 'Erro ao realizar login.');
      }
    } catch (error) {
      setTipoMensagem('erro');
      setMensagem('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LoginInput
        label="Usuário"
        id="usuario"
        name="usuario"
        value={formData.usuario}
        onChange={handleChange}
        placeholder="Ex: Rafhael"
      />

      <LoginInput
        label="Senha"
        id="senha"
        name="senha"
        type="password"
        value={formData.senha}
        onChange={handleChange}
        placeholder="••••••••"
      />

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-[#FF9B54] hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9B54] transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>
      </div>

      {/* Feedback de Mensagem */}
      {mensagem && (
        <div className={`mt-4 p-3 rounded text-sm text-center font-medium ${tipoMensagem === 'erro' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensagem}
        </div>
      )}
    </form>
  );
}
