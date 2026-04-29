import uuid
from datetime import datetime
from peewee import UUIDField, DateTimeField, ForeignKeyField, DeferredForeignKey

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Cupon.Cupon import Cupon
from Back.Core.Entitys.Usuario.Usuario import Usuario


class CuponUsuario(BaseModel):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    cupon = ForeignKeyField(Cupon, backref='usos', on_delete='CASCADE', column_name='cupon_id')
    usuario = ForeignKeyField(Usuario, backref='cupones_usados', on_delete='CASCADE', column_name='usuario_id')
    pedido = DeferredForeignKey('Pedido', backref='cupon_uso', on_delete='CASCADE', column_name='pedido_id')
    usado_en = DateTimeField(default=datetime.now)

    class Meta:
        table_name = 'cupon_usuario'
        indexes = (
            (('cupon', 'usuario'), True),
        )