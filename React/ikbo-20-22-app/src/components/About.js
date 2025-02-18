import React from 'react';
import Header from './Header';
import '../styles/About.css';
import '../styles/main.css';
function About(){
return(
    <div>
        <Header/>
        <div className='about'>
            <h1>Страничка о нас</h1>
            <p>Мы очень крутые</p>
        </div>
    </div>
    );
}
export default About;