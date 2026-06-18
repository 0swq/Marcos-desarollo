
import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from peewee import UUIDField, CharField, TextField, DateTimeField, ForeignKeyField

from Back.Core.Entitys.Usuario.Usuario import Usuario   # ← corregido
from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Producto.ProductoBase import ProductoBase
class Replica(BaseModel):
    ESTADOS = ('pendiente', 'procesando', 'listo', 'error')

    id               = UUIDField(primary_key=True, default=uuid.uuid4)
    usuario          = ForeignKeyField(Usuario,     backref='replicas', on_delete='CASCADE',
                                       column_name='usuario_id',      field='id')
    producto         = ForeignKeyField(ProductoBase, backref='replicas', on_delete='CASCADE',
                                       column_name='producto_base_id', field='id')
    imagen_original  = TextField()
    imagen_resultado = TextField(null=True)
    estado           = CharField(max_length=20, default='pendiente',
                                 choices=[(e, e) for e in ESTADOS])
    replicate_id     = CharField(max_length=100, null=True)
    prompt_usado     = TextField(null=True)
    created_at       = DateTimeField(default=datetime.now)

    class Meta:
        table_name = 'imagen_replica'
@dataclass
class ReplicaDetalle:
    id: str
    usuario_id: str
    producto_base_id: str
    producto_nombre: str
    imagen_original: str
    imagen_resultado: Optional[str]
    estado: str
    replicate_id: Optional[str]
    prompt_usado: Optional[str]
    created_at: datetime
    url_original: Optional[str] = None
    url_resultado: Optional[str] = None