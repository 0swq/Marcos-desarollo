import uuid
from datetime import datetime
from peewee import UUIDField, CharField, BooleanField, IntegerField, DateTimeField, ForeignKeyField
from peewee import DecimalField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Categoria.Categoria import Categoria
from Back.Core.Entitys.ProductoBase.ProductoBase import ProductoBase
from Back.Core.Entitys.Variante.Variante import Variante


class Cupon(BaseModel):
    TIPOS_DESCUENTO = ('porcentaje', 'monto_fijo')
    APLICA_A = ('carrito', 'categoria', 'producto_base', 'variante')

    id = UUIDField(primary_key=True, default=uuid.uuid4)
    codigo = CharField(max_length=50, unique=True)
    descripcion = CharField(null=True)
    tipo_descuento = CharField(max_length=20, choices=[(t, t) for t in TIPOS_DESCUENTO])
    valor = DecimalField(max_digits=10, decimal_places=2)
    aplica_a = CharField(max_length=20, default='carrito', choices=[(a, a) for a in APLICA_A])
    categoria = ForeignKeyField(Categoria, null=True, on_delete='SET NULL', column_name='categoria_id')
    producto_base = ForeignKeyField(ProductoBase, null=True, on_delete='SET NULL', column_name='producto_base_id')
    variante = ForeignKeyField(Variante, null=True, on_delete='SET NULL', column_name='variante_id')
    minimo_compra = DecimalField(max_digits=10, decimal_places=2, null=True)
    un_solo_uso = BooleanField(default=False)
    usos_maximos = IntegerField(null=True)
    usos_actuales = IntegerField(default=0)
    combinable_con_promocion = BooleanField(default=False)
    activo = BooleanField(default=True)
    valido_desde = DateTimeField(null=True)
    valido_hasta = DateTimeField(null=True)
    creado_en = DateTimeField(default=datetime.now)

    class Meta:
        table_name = 'cupon'