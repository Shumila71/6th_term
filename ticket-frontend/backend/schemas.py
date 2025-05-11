from pydantic import BaseModel, EmailStr

class EventOut(BaseModel):
    id: int
    name: str
    available_tickets: int

    class Config:
        from_attributes = True
    
class BookingCreate(BaseModel):
    email: EmailStr
    event_id: int
    ticket_count: int  # Добавляем количество билетов

class BookingOut(BaseModel):
    ticket_number: str
    email: EmailStr
    event_name: str