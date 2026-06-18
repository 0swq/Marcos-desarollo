import uuid
from peewee import UUIDField, CharField

from Back.Core.Connection.Postgre import BaseModel


class Proveedor(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    ruc = CharField(max_length=11, unique=True)
    telefono = CharField(max_length=20, null=True)

    class Meta:
        table_name = 'proveedor'