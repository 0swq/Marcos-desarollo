from typing import List, Optional
from Back.Core.Entitys.Pedido.Pedido import (
    Pedido, PedidoResumen, PedidoDetalle, DetallePedidoSchema, PagoSchema
)


def _pago_del_pedido(pedido_id: str) -> Optional[dict]:

    """Busca el pago asociado a un pedido (si existe)."""
    from Back.Core.Entitys.Pago.Pago import Pago  # import local para evitar circular
    pago = Pago.get_or_none(Pago.pedido_id == pedido_id)
    if not pago:
        return None
    return {
        "id": str(pago.id),
        "metodo": pago.metodo,
        "estado": pago.estado,
        "monto": float(pago.monto),
        "fecha": pago.fecha,
    }


def _items_del_pedido(pedido_id: str) -> List[dict]:
    """Devuelve los items del detalle_pedido para un pedido."""
    from Back.Core.Entitys.DetallePedido.DetallePedido import DetallePedido  # import local
    items = list(DetallePedido.select().where(DetallePedido.pedido_id == pedido_id))
    return [
        {
            "id": str(i.id),
            "variante_id": str(i.variante_id),
            "sku_ref": i.sku_ref,
            "nombre_ref": i.nombre_ref,
            "cantidad": i.cantidad,
            "precio_unitario": float(i.precio_unitario),
            "descuento_unitario": float(i.descuento_unitario),
        }
        for i in items
    ]


def _a_resumen(pedido: Pedido, pago: Optional[dict] = None) -> PedidoResumen:
    return PedidoResumen(
        id=str(pedido.id),
        fecha=pedido.fecha,
        estado=pedido.estado,
        tipo_entrega=pedido.tipo_entrega,
        subtotal=float(pedido.subtotal),
        costo_envio=float(pedido.costo_envio),
        descuento_aplicado=float(pedido.descuento_aplicado),
        total=float(pedido.total),
        pago_estado=pago["estado"] if pago else None,
        pago_metodo=pago["metodo"] if pago else None,
    )


def listar_por_usuario(usuario_id: str) -> List[PedidoResumen]:
    pedidos = list(
        Pedido.select()
        .where(Pedido.usuario_id == usuario_id)
        .order_by(Pedido.fecha.desc())
    )
    resultado = []
    for p in pedidos:
        pago = _pago_del_pedido(str(p.id))
        resultado.append(_a_resumen(p, pago))
    return resultado


def obtener_detalle(pedido_id: str, usuario_id: str) -> Optional[PedidoDetalle]:
    pedido = Pedido.get_or_none(
        (Pedido.id == pedido_id) & (Pedido.usuario_id == usuario_id)
    )
    if not pedido:
        return None

    pago = _pago_del_pedido(pedido_id)
    items = _items_del_pedido(pedido_id)

    # Datos opcionales
    cupon_codigo = None
    if pedido.cupon_id:
        from Back.Core.Entitys.Cupon.Cupon import Cupon
        cupon = Cupon.get_or_none(Cupon.id == pedido.cupon_id)
        cupon_codigo = cupon.codigo if cupon else None

    direccion_calle = direccion_ciudad = direccion_referencia = None
    if pedido.direccion_id:
        from Back.Core.Entitys.Direccion.Direccion import Direccion
        dir_ = Direccion.get_or_none(Direccion.id == pedido.direccion_id)
        if dir_:
            direccion_calle = dir_.calle
            direccion_ciudad = dir_.ciudad
            direccion_referencia = dir_.referencia

    return PedidoDetalle(
        id=str(pedido.id),
        fecha=pedido.fecha,
        estado=pedido.estado,
        tipo_entrega=pedido.tipo_entrega,
        subtotal=float(pedido.subtotal),
        costo_envio=float(pedido.costo_envio),
        descuento_aplicado=float(pedido.descuento_aplicado),
        total=float(pedido.total),
        pago_estado=pago["estado"] if pago else None,
        pago_metodo=pago["metodo"] if pago else None,
        cupon_codigo=cupon_codigo,
        direccion_calle=direccion_calle,
        direccion_ciudad=direccion_ciudad,
        direccion_referencia=direccion_referencia,
        items=[DetallePedidoSchema(**i) for i in items],
        pago=PagoSchema(**pago) if pago else None,
    )


def listar_todos() -> List[PedidoResumen]:
    """Solo para admin (lista todos los pedidos)"""
    pedidos = list(Pedido.select().order_by(Pedido.fecha.desc()))
    resultado = []
    for p in pedidos:
        pago = _pago_del_pedido(str(p.id))
        resultado.append(_a_resumen(p, pago))
    return resultado
