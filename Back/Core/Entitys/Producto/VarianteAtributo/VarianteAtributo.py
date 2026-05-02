from peewee import CharField, ForeignKeyField, CompositeKey

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Producto.Variante.Variante import Variante
from Back.Core.Entitys.Producto.TipoAtributo.TipoAtributo import TipoAtributo


class VarianteAtributo(BaseModel):
    variante = ForeignKeyField(Variante, backref='atributos', on_delete='CASCADE', column_name='variante_id')
    tipo_atributo = ForeignKeyField(TipoAtributo, backref='variantes', on_delete='CASCADE', column_name='tipo_atributo_id')
    valor = CharField(max_length=120)

    class Meta:
        table_name = 'variante_atributo'
        primary_key = CompositeKey('variante', 'tipo_atributo')