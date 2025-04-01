import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/login', credentials);
      
      if (response.data && response.data.token && response.data.user) {
        onLogin(response.data);
        navigate('/');
      } else {
        throw new Error('Неверный формат ответа сервера');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         'Ошибка при входе';
      setError(errorMessage);
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Вход</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          placeholder="Пароль"
          required
        />
        <button type="submit">Войти</button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default LoginForm;