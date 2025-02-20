import React from 'react';
import Header from './Header';
import '../styles/Home.css';
import '../styles/main.css';
function Home({message}){
return(
    <div>
        <Header/>
        <div className='home'>
            <h1>Здесь дом?</h1>
            <p>Однушка.</p>
            <br></br>
            <br></br>
            <p>{message}</p>
        </div>
    </div>
    );
}
export default Home;