from datetime import datetime
from app.databases import Base
from sqlalchemy import Column, DateTime, Integer, String

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    username = Column(String(100),nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    session_token: str = Column(String(200), nullable=True)
    session_expiry: datetime = Column(DateTime, nullable=True)