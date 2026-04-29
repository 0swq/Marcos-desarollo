import uuid
from peewee import UUIDField, CharField, IntegerField, ForeignKeyField, DecimalField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Pedido.Pedido import Pedido
from Back.Core.Entitys.Variante.Variante import Variante


class DetallePedido(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    pedido = ForeignKeyField(Pedido, backref='detalles', on_delete='CASCADE', column_name='pedido_id')
    variante = ForeignKeyField(Variante, backref='detalles_pedido', on_delete='CASCADE', column_name='variante_id')
    sku_ref = CharField(max_length=100)
    nombre_ref = CharField(max_length=200)
    cantidad = IntegerField()
    precio_unitario = DecimalField(max_digits=10, decimal_places=2)
    descuento_unitario = DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        table_name = 'detalle_pedido'
