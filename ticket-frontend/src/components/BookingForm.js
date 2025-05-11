import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Booking.css"


const BookingForm = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get("/events").then((res) => setEvents(res.data));
  }, []);

  const isFormValid = () => {
    return email.trim() !== "" && selectedEvent !== "" && ticketCount > 0;
  };

  const bookTicket = async () => {
    if (!isFormValid()) {
      setMessage("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (ticketCount > 5) {
      setMessage("Нельзя забронировать больше 5 билетов.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const userBookings = await axios.get(`/bookings/${email}`);
      const userEventBookings = userBookings.data.filter(
        (booking) => booking.event_name === selectedEvent
      );

      const totalBooked = userEventBookings.reduce((acc) => acc + 1, 0);

      if (totalBooked + ticketCount > 5) {
        setMessage(
          `Вы уже забронировали ${totalBooked} билетов. Максимум — 5.`
        );
        return;
      }

      const res = await axios.post("/book", {
        email,
        event_id: parseInt(selectedEvent),
        ticket_count: ticketCount,
      });

      setMessage(() => {
        if (ticketCount === 1) {
          return `Билет забронирован: ${res.data.event_name}, номер билета: ${res.data.ticket_number}`;
        } else {
          return `Билеты забронированы: ${res.data.event_name}, номера билетов: ${res.data.ticket_number}`;
        }
      });

      // Сбрасываем форму после успешного бронирования
      setSelectedEvent("");
      setTicketCount(1);
      axios.get("/events").then((res) => setEvents(res.data));
    } catch (err) {
      setMessage(`Ошибка: ${err.response?.data?.detail || "Произошла ошибка"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
        <div className="norm">
        <h1>Бронирование билетов</h1>
        <div className="form-group">
            <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={email.trim() === "" ? "input-error" : ""}
            />
        </div>
        <div className="form-group">
            <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className={selectedEvent === "" ? "input-error" : ""}
            >
            <option value="">Выбери мероприятие*</option>
            {events.map((event) => (
                <option key={event.id} value={event.id}>
                {event.name} ({event.available_tickets} доступно)
                </option>
            ))}
            </select>
        </div>
        <p>Введите количество билетов: </p>
        <div className="form-group">
            <input
            type="number"
            min="1"
            max="5"
            placeholder="Количество билетов*"
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
            className={ticketCount < 1 ? "input-error" : ""}
            />
        </div>
        <button 
            onClick={bookTicket}
            disabled={!isFormValid() || isSubmitting}
            className={!isFormValid() ? "disabled-button" : "button_on"}
        >
            {isSubmitting ? "Обработка..." : "Забронировать"}
        </button>
        </div>
        {message && <p className="message">{message}</p>}
    </div>
  );
};

export default BookingForm;