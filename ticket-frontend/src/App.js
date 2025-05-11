import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListEvents from "./components/ListEvents";
import SearchEvents from "./components/SearchEvents";
import BookingForm from "./components/BookingForm";
import Header from "./components/Header";
import "./styles/main.css";

function App() {
  return (
      <Router>
      <Header/>
      <div className="app">
        <Routes>
          <Route path="/" element={<ListEvents />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/search" element={<SearchEvents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;