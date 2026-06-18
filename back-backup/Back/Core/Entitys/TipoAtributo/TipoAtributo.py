import uuid
from peewee import UUIDField, CharField

from Back.Core.Connection.Postgre import BaseModel


class TipoAtributo(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    nombre = CharField(max_length=80, unique=True)

    class Meta:
        table_name = 'tipo_atributo'