import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import './App.css'


function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route exect path="/" element={<Home message="Продам гараж." />} /> 
                    <Route exect path="/about" element={<About />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;