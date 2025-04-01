import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    username: '',
    age: '',
    position: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Проверяем, что пользователь аутентифицирован
      if (!user || !token) {
        throw new Error('Требуется авторизация');
      }

      // Добавляем createdBy к данным сотрудника
      const employeeData = {
        ...employee,
        createdBy: user.id
      };

      const response = await axios.post('http://localhost:5000/employees', employeeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Employee added:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error adding employee:', error);
      setError(error.response?.data?.error || error.message || 'Ошибка при добавлении сотрудника');
    }
  };

  return (
    <div>
      <h2>Добавить работника</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Остальная часть формы без изменений */}
        <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Логин</label>
          <input
            type="text"
            name="username"
            value={employee.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Возраст</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            onChange={handleChange}
            required
            min="18"
          />
        </div>
        <div className="form-group">
          <label>Позиция</label>
          <input
            type="text"
            name="position"
            value={employee.position}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Добавить</button>
      </form>
    </div>
  );
};

export default AddEmployee;