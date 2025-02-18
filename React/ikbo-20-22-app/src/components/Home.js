import React from 'react';
import Header from './Header';
import '../styles/Home.css';
import '../styles/main.css';
function Home(){
return(
    <div>
        <Header/>
        <div className='home'>
            <h1>Ну здесь дом?</h1>
            <p>Однушка.</p>
        </div>
    </div>
    );
}
export default Home;