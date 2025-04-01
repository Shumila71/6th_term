import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState({
    name: '',
    username: '',
    age: '',
    position: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axios.get(`http://localhost:5000/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEmployee(res.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        ...employee,
        age: Number(employee.age)
      };
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Требуется авторизация');
      }
      await axios.put(`http://localhost:5000/employees/${id}`, employeeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  return (
    <div>
      <h2>Изменить данные</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">Обновить</button>
      </form>
    </div>
  );
};

export default EditEmployee;