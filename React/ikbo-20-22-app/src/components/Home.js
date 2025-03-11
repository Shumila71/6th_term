import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Домашняя страница</h1>
      <Link to="/login">Войти</Link>
    </div>
  );
};

export default Home;