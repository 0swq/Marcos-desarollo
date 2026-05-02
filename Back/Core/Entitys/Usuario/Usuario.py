from dataclasses import dataclass
from typing import Optional
from datetime import datetime

from peewee import CharField, DateTimeField, BooleanField

from Back.Core.Connection.Postgre import BaseModel


class Usuario(BaseModel):
    ROLES = ('admin', 'cliente')
    TIPOS = ('minorista', 'mayorista')
    NIVELES = ('bronce', 'plata', 'oro', 'platino')

    id = CharField(max_length=128, primary_key=True)
    rol = CharField(max_length=20, default='cliente', choices=[(r, r) for r in ROLES])
    tipo_usuario = CharField(max_length=20, default='minorista', choices=[(t, t) for t in TIPOS])
    nivel = CharField(max_length=20, null=True, choices=[(n, n) for n in NIVELES])
    nivel_valido_hasta = DateTimeField(null=True)
    activo = BooleanField(default=True)

    class Meta:
        table_name = 'usuario'

@dataclass
class UsuarioCompleto:
    # Clerk
    id: str
    nombre: str
    apellido: str
    email: str
    creado_en:datetime
    #DB
    rol: str
    tipo_usuario: str
    nivel: Optional[str]
    nivel_valido_hasta:Optional[datetime]
    activo: bool