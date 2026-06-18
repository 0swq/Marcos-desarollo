import uuid
from peewee import UUIDField, CharField, BooleanField, ForeignKeyField

from Back.Core.Connection.Postgre import BaseModel


class Categoria(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    nombre = CharField(max_length=120)
    padre = ForeignKeyField('self', backref='subcategorias', null=True, on_delete='SET NULL', column_name='padre_id')
    activa = BooleanField(default=True)

    class Meta:
        table_name = 'categoria'