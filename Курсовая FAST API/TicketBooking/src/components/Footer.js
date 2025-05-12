import React from 'react';
import '../styles/Footer.css'; 

const BookingNotice = () => {
  return (
    <footer className="booking-notice">
      <div className="notice-content">
        <h3>Важная информация</h3>
        <p>
          На нашем сервисе производится только <strong>бронирование</strong> билетов, 
          а не их выкуп. Это сделано для предотвращения массовой скупки билетов 
          и обеспечения равного доступа всех желающих к мероприятиям.
        </p>
        <p>
          Забронированные билеты необходимо выкупить в кассах мероприятий.
        </p>
      </div>
    </footer>
  );
};

export default BookingNotice;