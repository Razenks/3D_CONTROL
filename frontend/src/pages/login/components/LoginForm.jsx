import React, { useState } from 'react';
import LoginInput from './LoginInput';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

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

    /* ====================================================================
    BLOCO FETCH COMENTADO - PRONTO PARA INTEGRAÇÃO FUTURA COM O PHP
    ====================================================================
    try {
      const response = await fetch('http://localhost/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.sucesso) {
        setMensagem('Login realizado com sucesso! Redirecionando...');
        // window.location.href = '/dashboard'; // Exemplo de redirecionamento
      } else {
        setMensagem(data.erro || 'Erro ao realizar login.');
      }
    } catch (error) {
      setMensagem('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
    ====================================================================
    */

    // Simulação temporária de requisição para testes de UI
    setTimeout(() => {
      console.log('Dados submetidos:', formData);
      setMensagem('Simulação: Lógica de requisição está comentada.');
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LoginInput
        label="Usuário ou E-mail"
        id="usuario"
        name="usuario"
        value={formData.usuario}
        onChange={handleChange}
        placeholder="Digite seu usuário"
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
        <div className={`mt-4 p-3 rounded text-sm text-center font-medium ${mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {mensagem}
        </div>
      )}
    </form>
  );
}