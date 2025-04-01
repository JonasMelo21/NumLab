# app/create_tables.py
from .models import Base
from .databases import engine

Base.metadata.create_all(bind=engine)

print("Tabelas criadas com sucesso!")