import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Dialog from './components/Dialog';
import './styles/App.css'


function App() {
    return (
        <Router>
            <Header/>
            <div className="app">
                <Routes>
                    <Route exect path="/" element={<Home message="Продам гараж." />} /> 
                    <Route exect path="/about" element={<About />}/>
                    <Route exect path="/dialog" element={<Dialog />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;