import uuid
from Back.Core.Entitys.Pago.Pago import Pago
def registrar(pedido_id, metodo, monto, order_number=None, transaction_id=None,
              order_status='UNPAID', respuesta=None):
    return Pago.create(
        id=uuid.uuid4(),
        pedido=pedido_id,
        metodo=metodo,
        monto=monto,
        order_number=order_number or uuid.uuid4().hex[:12],
        transaction_id=transaction_id,
        order_status=order_status,
        respuesta_pasarela=respuesta,
    )
def obtener_por_id(pago_id):
    return Pago.get_or_none(Pago.id == pago_id)
def listar_por_pedido(pedido_id):
    return list(Pago.select().where(Pago.pedido == pedido_id))
def actualizar_estado(pago_id, order_status):
    return Pago.update(order_status=order_status).where(Pago.id == pago_id).execute() > 0
def actualizar_respuesta(pago_id, transaction_id, order_status, respuesta_json):
    return Pago.update(
        transaction_id=transaction_id,
        order_status=order_status,
        respuesta_pasarela=respuesta_json,
    ).where(Pago.id == pago_id).execute() > 0
