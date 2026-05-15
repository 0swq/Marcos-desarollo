import uuid
from datetime import datetime
from typing import Optional, List #agregado
from pydantic import BaseModel as PydanticBase #agregado
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


class DetallePedidoSchema(PydanticBase):
    id: str
    variante_id: str
    sku_ref: str
    nombre_ref: str
    cantidad: int
    precio_unitario: float
    descuento_unitario: float

    class Config:
        from_attributes = True


class PagoSchema(PydanticBase):
    id: str
    metodo: str
    estado: str          # aprobado | rechazado
    monto: float
    fecha: datetime

    class Config:
        from_attributes = True


class PedidoResumen(PydanticBase):

    """Para el listado """
    id: str
    fecha: datetime
    estado: str
    tipo_entrega: str
    subtotal: float
    costo_envio: float
    descuento_aplicado: float
    total: float
    pago_estado: Optional[str] = None   # aprobado | rechazado | None
    pago_metodo: Optional[str] = None

    class Config:
        from_attributes = True


class PedidoDetalle(PedidoResumen):
    """Para detalle  de un pedido."""
    cupon_codigo: Optional[str] = None
    direccion_calle: Optional[str] = None
    direccion_ciudad: Optional[str] = None
    direccion_referencia: Optional[str] = None
    items: List[DetallePedidoSchema] = []
    pago: Optional[PagoSchema] = None

    class Config:
        from_attributes = True