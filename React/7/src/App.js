import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import AgreementForm from './components/AgreementForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';

import './styles/main.css';

const App = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("isAuthenticated=",isAuthenticated);
    return (
        <Router>
            <div>
                <h1>Соглашайся, брат</h1>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? (<Navigate to="/" /> ) : (<LoginForm /> )}
                    />
                    
                    <Route path="/register" element={isAuthenticated ? (<Navigate to="/" />): (<RegisterForm /> )} />
                    
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (<EmployeeList />) : (<Navigate to="/login" /> )}
                    />
                    <Route path="/add" element={<AddEmployee />} />
                    <Route path="/edit/:id" element={<EditEmployee />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;