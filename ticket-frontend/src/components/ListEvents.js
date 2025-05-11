import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ListEvents.css";

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    axios.get("/events").then((res) => setEvents(res.data));
  }, []);

  const filteredEvents = events
    .filter((event) =>
      event.name.toLowerCase().includes(eventFilter.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="events-container">
      <div className="events-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h1>Мероприятия</h1>
        <span>
          ▼
        </span>
      </div>
      
      <div className="events-content">
        <input
          type="text"
          placeholder="Поиск мероприятий..."
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="search-input"
        />
        
        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-name">{event.name}</div>
              <div className="event-tickets">
                Доступно билетов: <span>{event.available_tickets}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEvents;