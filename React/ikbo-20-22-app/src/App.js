import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';

import './styles/main.css';

const App = () => {
    const [user, setUser] = useState(null);
  
    // Безопасное чтение из localStorage
    useEffect(() => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error reading auth data:', error);
        logout();
      }
    }, []);
  
    const login = (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    };
  
    const register = (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    };
  
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    };
  
    return (
      <Router>
        <div>
          {user && (
            <div>
              <span>Привет, {user.name}!</span>
              <button onClick={logout}>Выйти</button>
            </div>
          )}
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm onLogin={login} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterForm onRegister={register} />} />
            <Route path="/" element={user ? <EmployeeList /> : <Navigate to="/login" />} />
            <Route path="/add" element={user ? <AddEmployee /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={user ? <EditEmployee /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  };
  
  export default App;