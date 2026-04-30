import uuid
from datetime import datetime
from peewee import UUIDField, CharField, BooleanField, DateTimeField, ForeignKeyField
from peewee import DecimalField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Usuario.Usuario import Usuario
from Back.Core.Entitys.Cupon.Cupon import Cupon


class Carrito(BaseModel):
    ESTADOS = ('activo', 'convertido', 'abandonado')

    id = UUIDField(primary_key=True, default=uuid.uuid4)
    usuario = ForeignKeyField(Usuario, backref='carritos', on_delete='CASCADE', column_name='usuario_id', field='id')
    cupon = ForeignKeyField(Cupon, backref='carritos', null=True, on_delete='SET NULL', column_name='cupon_id')
    descuento_total = DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = CharField(max_length=20, default='activo', choices=[(e, e) for e in ESTADOS])
    creado_en = DateTimeField(default=datetime.now)

    class Meta:
        table_name = 'carrito'