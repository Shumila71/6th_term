import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [form, setForm] = useState({ 
    name: '', 
    username: '', 
    age: '', 
    position: '' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      // Преобразуем возраст в число
      const employeeData = {
        ...form,
        age: Number(form.age)
      };

      await axios.post('http://localhost:5000/employees', employeeData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      navigate('/');
    } catch (error) {
      console.error('Ошибка при добавлении:', error);
      setError(error.response?.data?.error || error.message || 'Ошибка при добавлении сотрудника');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Добавить работника</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '15px',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Имя</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Логин</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Возраст</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            min="18"
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Позиция</label>
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;