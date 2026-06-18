import os
from peewee import PostgresqlDatabase, Model

db = PostgresqlDatabase(
    os.getenv("DB_NAME", "aglome_db"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASS", "password"),
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", 5432))
)

class BaseModel(Model):
    class Meta:
        database = db