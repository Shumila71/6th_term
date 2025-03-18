import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../actions/authActions';

const RegisterForm = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' });
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(userData));
        console.log("success register")
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
            <input type="email" placeholder="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
            <input type="password" placeholder="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value} )} />
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;