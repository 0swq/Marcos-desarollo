import uuid
from datetime import datetime
from peewee import (UUIDField, CharField, DateTimeField, ForeignKeyField,
                    DecimalField, TextField, DateField, TimeField)

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Usuario.Usuario import Usuario
from Back.Core.Entitys.Carrito.Carrito import Carrito
from Back.Core.Entitys.Direccion.Direccion import Direccion
from Back.Core.Entitys.Cupon.Cupon import Cupon


class Pedido(BaseModel):
    ESTADOS = ('pendiente', 'confirmado', 'completado', 'cancelado')
    TIPOS_ENTREGA = ('DELIVERY', 'RECOJO')

    id = UUIDField(primary_key=True, default=uuid.uuid4)
    usuario = ForeignKeyField(Usuario, backref='pedidos', on_delete='CASCADE', column_name='usuario_id', field='id')
    carrito = ForeignKeyField(Carrito, backref='pedido', null=True, on_delete='SET NULL', column_name='carrito_id')
    cupon = ForeignKeyField(Cupon, backref='pedidos', null=True, on_delete='SET NULL', column_name='cupon_id')
    descuento_aplicado = DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = DecimalField(max_digits=10, decimal_places=2)
    costo_envio = DecimalField(max_digits=10, decimal_places=2, default=0)
    total = DecimalField(max_digits=10, decimal_places=2)
    tipo_entrega = CharField(max_length=20, choices=[(t, t) for t in TIPOS_ENTREGA])
    direccion = ForeignKeyField(Direccion, backref='pedidos', null=True, on_delete='SET NULL',
                                column_name='direccion_id')

    estado = CharField(max_length=20, default='pendiente', choices=[(e, e) for e in ESTADOS])
    fecha = DateTimeField(default=datetime.now)

    class Meta:
        table_name = 'pedido'
