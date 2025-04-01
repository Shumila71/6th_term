import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error.response?.data?.error || 'Не удалось загрузить список сотрудников');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Обновляем список после удаления
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError(error.response?.data?.error || 'Не удалось удалить сотрудника');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', margin: '20px' }}>
        {error}
        <button onClick={fetchEmployees} style={{ marginLeft: '10px' }}>
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Список сотрудников</h2>
        <Link 
          to="/add" 
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Добавить сотрудника
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Имя</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Логин</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Возраст</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Должность</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{employee.name}</td>
                <td style={{ padding: '12px' }}>{employee.username}</td>
                <td style={{ padding: '12px' }}>{employee.age}</td>
                <td style={{ padding: '12px' }}>{employee.position}</td>
                <td style={{ padding: '12px' }}>
                  <Link 
                    to={`/edit/${employee.id}`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      marginRight: '8px'
                    }}
                  >
                    Изменить
                  </Link>
                  <button 
                    onClick={() => {
                      if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
                        deleteEmployee(employee.id);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Нет данных о сотрудниках
        </div>
      )}
    </div>
  );
};

export default EmployeeList;