import uuid
from peewee import UUIDField, IntegerField, ForeignKeyField, DecimalField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Carrito.Carrito import Carrito
from Back.Core.Entitys.Producto.Variante.Variante import Variante


class CarritoItem(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    carrito = ForeignKeyField(Carrito, backref='items', on_delete='CASCADE', column_name='carrito_id')
    variante = ForeignKeyField(Variante, backref='carrito_items', on_delete='CASCADE', column_name='variante_id')
    cantidad = IntegerField(default=1)
    precio_unitario = DecimalField(max_digits=10, decimal_places=2)
    descuento_unitario = DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        table_name = 'carrito_item'
        indexes = (
            (('carrito', 'variante'), True),
        )