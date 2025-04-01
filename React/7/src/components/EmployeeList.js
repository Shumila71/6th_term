import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <h2>Работники</h2>
      <Link to="/add" className="btn btn-primary">Добавить сотрудника</Link>
      <table className="table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Логин</th>
            <th>Возраст</th>
            <th>Позиция</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.username}</td>
              <td>{employee.age}</td>
              <td>{employee.position}</td>
              <td>
                <Link to={`/edit/${employee.id}`} className="btn btn-info">Изменить</Link>
                <button onClick={() => deleteEmployee(employee.id)} className="btn btn-danger">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;