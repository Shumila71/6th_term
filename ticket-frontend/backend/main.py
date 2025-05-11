from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal 
from models import Base, Event, Booking
from schemas import EventOut, BookingCreate, BookingOut
import uuid

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables (на всякий случай)
Base.metadata.create_all(bind=SessionLocal.kw["bind"])

# Routes
@app.get("/events", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@app.post("/book", response_model=BookingOut)
def book_ticket(data: BookingCreate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.available_tickets <= 0:
        raise HTTPException(status_code=400, detail="No tickets available")
    
    # Проверка на количество забронированных билетов у пользователя
    user_bookings = db.query(Booking).filter(Booking.email == data.email, Booking.event_id == data.event_id).all()
    total_booked = len(user_bookings)
    
    if total_booked + data.ticket_count > 5:
        raise HTTPException(status_code=400, detail=f"Вы уже забронировали {total_booked}, максимальное количество билетов для бронирования - 5.")
    
    # Бронирование билетов
    ticket_numbers = []
    for _ in range(data.ticket_count):
        ticket_number = str(uuid.uuid4())
        booking = Booking(
            email=data.email,
            event_id=data.event_id,
            ticket_number=ticket_number
        )
        db.add(booking)
        ticket_numbers.append(ticket_number)

    event.available_tickets -= data.ticket_count
    db.commit()

    return BookingOut(
        ticket_number=", ".join(ticket_numbers),
        email=data.email,
        event_name=event.name
    )

@app.get("/bookings/{email}", response_model=list[BookingOut])
def get_bookings_by_email(email: str, db: Session = Depends(get_db)):
    bookings = db.query(Booking).join(Event).filter(Booking.email == email).all()
    return [
        BookingOut(
            ticket_number=b.ticket_number,
            email=b.email,
            event_name=b.event.name
        ) for b in bookings
    ]
