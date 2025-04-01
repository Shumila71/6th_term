import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../actions/authActions';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(credentials));
        console.log("success login")
    };

    return (
      <div>
        <Link to = "/register">Регистрация</Link>
        <form onSubmit={handleSubmit}>
            <input type="email" value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
            <input type="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
            <button type="submit">Login</button>
        </form>
      </div>
    );
};

export default LoginForm;