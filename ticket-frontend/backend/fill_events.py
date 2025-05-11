from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Event
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/postgres")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

events_data = [
    {"name": "Концерт Imagine Dragons", "available_tickets": 150},
    {"name": "Фестиваль уличной еды", "available_tickets": 200},
    {"name": "Бизнес-конференция 2025", "available_tickets": 100},
    {"name": "Tech Meetup", "available_tickets": 80},
    {"name": "Киноночь Marvel", "available_tickets": 120},
    {"name": "Выставка современного искусства", "available_tickets": 90},
    {"name": "Гастрономический мастер-класс", "available_tickets": 50},
    {"name": "Рок-фестиваль 'Гром'", "available_tickets": 300},
    {"name": "Научный симпозиум", "available_tickets": 70},
    {"name": "Футбольный матч: Локомотив - Спартак", "available_tickets": 250},
    {"name": "Театральная премьера 'Гамлет'", "available_tickets": 110},
    {"name": "Фестиваль вина", "available_tickets": 180},
    {"name": "Киберспортивный турнир", "available_tickets": 150},
    {"name": "Йога-ретрит на природе", "available_tickets": 60},
    {"name": "Джазовый вечер", "available_tickets": 85},
    {"name": "Выставка ретро-автомобилей", "available_tickets": 120},
    {"name": "Фестиваль воздушных шаров", "available_tickets": 200},
    {"name": "Мастер-класс по фотографии", "available_tickets": 40},
    {"name": "Балет 'Лебединое озеро'", "available_tickets": 130},
    {"name": "Фестиваль науки", "available_tickets": 170}
]

def recreate_and_populate_events():
    # Удаляем все таблицы (включая зависимые, если они есть)
    Base.metadata.drop_all(bind=engine)
    # Создаем таблицы заново
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Добавляем все события из списка
        for event_data in events_data:
            event = Event(**event_data)
            db.add(event)
        db.commit()
        print(f"Добавлено {len(events_data)} событий")
    except Exception as e:
        db.rollback()
        print(f"Ошибка при добавлении событий: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    recreate_and_populate_events()
    print("События добавлены в базу данных.")
