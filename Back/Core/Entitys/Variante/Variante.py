import uuid
from peewee import UUIDField, CharField, BooleanField, IntegerField, ForeignKeyField
from peewee import DecimalField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.ProductoBase.ProductoBase import ProductoBase


class Variante(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    producto_base = ForeignKeyField(ProductoBase, backref='variantes', on_delete='CASCADE', column_name='producto_base_id')
    sku = CharField(max_length=100, unique=True)
    precio_venta = DecimalField(max_digits=10, decimal_places=2)
    precio_mayorista = DecimalField(max_digits=10, decimal_places=2, null=True)
    precio_minimo = DecimalField(max_digits=10, decimal_places=2, null=True)
    stock = IntegerField(default=0)
    activa = BooleanField(default=True)

    class Meta:
        table_name = 'variante'