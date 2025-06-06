import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = ({ onRegister }) => {
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/register', userData);
      
      if (response.data && response.data.token && response.data.user) {
        onRegister(response.data);
        navigate('/');
      } else {
        throw new Error('Неверный формат ответа сервера');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         'Ошибка при регистрации';
      setError(errorMessage);
      console.error('Register error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({...userData, name: e.target.value})}
          placeholder="Имя"
          required
        />
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({...userData, password: e.target.value})}
          placeholder="Пароль"
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  );
};

export default RegisterForm;