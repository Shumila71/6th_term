import React, { useState } from "react";
import axios from "axios";

const SearchEvents = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [bookings, setBookings] = useState([]);

  const findBookings = async () => {
    const res = await axios.get(`/bookings/${searchEmail}`);
    setBookings(res.data);
  };

  return (
    <div class = "norm">
      <h1>Поиск билетов</h1>
      <input
        type="email"
        placeholder="Email для поиска"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />
      <button onClick={findBookings}>Найти</button>
      <ul>
        {bookings.map((b) => (
          <li key={b.ticket_number}>
            {b.event_name} — Билет #{b.ticket_number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchEvents;