import React  from "react";
import { Link, useLocation } from "react-router-dom";
import '../styles/Header.css';

const Header = () => {
    const location = useLocation();
    return(
      <header>
        <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Мероприятия</Link>
        <Link to="/booking" className={location.pathname === '/booking' ? 'active-link' : ''}>Бронирование</Link>
        <Link to="/search" className={location.pathname === '/search' ? 'active-link' : ''}>Мои билеты</Link>
      </header>
    );
};


export default Header;