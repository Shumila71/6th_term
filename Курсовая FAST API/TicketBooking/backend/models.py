from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import engine  # Импортируем engine для использования в создании БД
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    available_tickets = Column(Integer, default=0)
    bookings = relationship("Booking", back_populates="event")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    ticket_number = Column(String, unique=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    event = relationship("Event", back_populates="bookings")

