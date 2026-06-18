import uuid
from datetime import datetime
from peewee import UUIDField, CharField, DateTimeField, ForeignKeyField, DecimalField, TextField

from Back.Core.Connection.Postgre import BaseModel
from Back.Core.Entitys.Pedido.Pedido import Pedido
class Pago(BaseModel):
    ORDER_STATUS = ('PAID', 'UNPAID', 'UNKNOWN')

    id = UUIDField(primary_key=True, default=uuid.uuid4)
    pedido = ForeignKeyField(Pedido, backref='pagos', on_delete='CASCADE', column_name='pedido_id')
    transaction_id = CharField(max_length=100, null=True, help_text='transactionId de Izipay')
    order_number = CharField(max_length=100, null=True, help_text='orderNumber enviado a Izipay')
    order_status = CharField(max_length=20, choices=[(s, s) for s in ORDER_STATUS], help_text='PAID | UNPAID | UNKNOWN')
    metodo = CharField(max_length=50, default="")
    monto = DecimalField(max_digits=10, decimal_places=2)
    respuesta_pasarela = TextField(null=True, help_text='JSON completo de respuesta Izipay')
    fecha = DateTimeField(default=datetime.now)

    class Meta:
        table_name = 'pago'
