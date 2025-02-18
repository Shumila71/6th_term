import React from 'react';
import '../styles/Header.css';
import '../styles/main.css';
import { Link } from 'react-router-dom';
function Header(){
return(
    <header>
        <Link to="/">Главная</Link>
        <Link to="/about"> О нас</Link>
        {/* <Link to=""> Страница 2</Link>
        <Link to=""> Страница 3</Link> */}
    </header>
    );
}
export default Header;