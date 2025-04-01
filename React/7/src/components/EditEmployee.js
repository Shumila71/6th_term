import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
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
      const res = await axios.get(`http://localhost:5000/employees/${id}`);
      setEmployee(res.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
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
      await axios.put(`http://localhost:5000/employees/${id}`, employee);
      navigate('/');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

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