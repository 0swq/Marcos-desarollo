from datetime import datetime

from peewee import CharField, DateTimeField,BooleanField

from Back.Core.Connection.Postgre import BaseModel


class Usuario(BaseModel):
    ROLES = ('admin', 'cliente')
    TIPOS = ('minorista', 'mayorista')
    NIVELES = ('bronce', 'plata', 'oro', 'platino')

    id = CharField(max_length=122, unique=True, default=None)
    mail = CharField(max_length=150, unique=True)
    nombres = CharField(max_length=100, null=True)
    apellidos = CharField(max_length=100, null=True)
    usuario = CharField(max_length=50, unique=True, null=True)
    rol = CharField(max_length=20, default='cliente', choices=[(r, r) for r in ROLES])
    tipo_usuario = CharField(max_length=20, default='minorista', choices=[(t, t) for t in TIPOS])
    creado_en = DateTimeField(default=datetime.now)
    activo = BooleanField(default=True)
    nivel = CharField(max_length=20, null=True, choices=[(n, n) for n in NIVELES])
    nivel_valido_hasta = DateTimeField(null=True)

    class Meta:
        table_name = 'usuario'

