import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import './styles/main.css'


const App = () => {
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
        return (
            
            <Router>
                {isAuthenticated && <LogoutButton />}
                <Routes>
                    <Route exect path="/" element={isAuthenticated ? (<Navigate to="/dashboard" />) : (<Home />)}/>
                    <Route exect path="/login" element={isAuthenticated ? (<Navigate to="/dashboard" />) : (<LoginForm />)}/>
                    <Route exect path="/dashboard" element={isAuthenticated ? (<Dashboard />) : (<Navigate to="/login" />)}/>
                </Routes>
                
            </Router>
            );
};

export default App;