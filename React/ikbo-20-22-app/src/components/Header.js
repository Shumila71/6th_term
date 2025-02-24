import React from 'react';
import '../styles/Header.css';
import '../styles/main.css';
import { Link, useLocation } from 'react-router-dom';
function Header(){
    const location = useLocation();
    return(
        <header>
            <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Главная</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active-link' : ''}> О нас</Link>
            <Link to="/dialog" className={location.pathname === '/dialog' ? 'active-link' : ''}>Диалоги</Link>
        </header>
    );
}
export default Header;