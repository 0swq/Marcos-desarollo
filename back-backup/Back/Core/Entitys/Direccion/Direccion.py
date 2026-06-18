import uuid
from peewee import UUIDField, CharField, BooleanField, TextField, ForeignKeyField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Usuario.Usuario import Usuario


class Direccion(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    usuario = ForeignKeyField(Usuario, backref='direcciones', on_delete='CASCADE', column_name='usuario_id', field='id')
    alias = CharField(max_length=50, null=True)
    calle = TextField()
    ciudad = CharField(max_length=100)
    referencia = TextField(null=True)
    es_principal = BooleanField(default=False)

    class Meta:
        table_name = 'direccion'