import uuid
from peewee import UUIDField, CharField, BooleanField, DateTimeField, ForeignKeyField, DecimalField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Categoria.Categoria import Categoria
from Back.Core.Entitys.ProductoBase.ProductoBase import ProductoBase
from Back.Core.Entitys.Variante.Variante import Variante


class Promocion(BaseModel):
    TIPOS_DESCUENTO = ('porcentaje', 'monto_fijo')
    APLICA_A = ('variante', 'producto_base', 'categoria')

    id = UUIDField(primary_key=True, default=uuid.uuid4)
    nombre = CharField(max_length=100)
    tipo_descuento = CharField(max_length=20, choices=[(t, t) for t in TIPOS_DESCUENTO])
    valor = DecimalField(max_digits=10, decimal_places=2)
    aplica_a = CharField(max_length=20, default='variante', choices=[(a, a) for a in APLICA_A])
    categoria = ForeignKeyField(Categoria, null=True, on_delete='SET NULL', column_name='categoria_id')
    producto_base = ForeignKeyField(ProductoBase, null=True, on_delete='SET NULL', column_name='producto_base_id')
    variante = ForeignKeyField(Variante, null=True, on_delete='SET NULL', column_name='variante_id')
    activa = BooleanField(default=True)
    valido_desde = DateTimeField()
    valido_hasta = DateTimeField()

    class Meta:
        table_name = 'promocion'