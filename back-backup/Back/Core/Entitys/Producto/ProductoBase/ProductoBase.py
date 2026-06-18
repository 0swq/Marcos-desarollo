import uuid
from peewee import UUIDField, CharField, BooleanField, TextField, ForeignKeyField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Categoria.Categoria import Categoria
from Back.Core.Entitys.Proveedor.Proveedor import Proveedor


class ProductoBase(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    nombre = CharField(max_length=200)
    descripcion = TextField(null=True)
    marca = CharField(max_length=100, null=True)
    unidades = CharField(max_length=50, default='UNIDADES')
    categoria = ForeignKeyField(Categoria, backref='productos', null=True, on_delete='SET NULL', column_name='categoria_id')
    proveedor = ForeignKeyField(Proveedor, backref='productos', null=True, on_delete='SET NULL', column_name='proveedor_id')
    publicado = BooleanField(default=False)
    class Meta:
        table_name = 'producto_base'