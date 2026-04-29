from Back.Core.Entitys.Pago import Pago
import Back.Core.Entitys.Pago.Pago_repo as pago_repository
import Back.Core.Entitys.Pedido.Pedido_repo as venta_repository

METODOS_VALIDOS = ('efectivo', 'yape', 'plin', 'transferencia', 'tarjeta')


def crear_pago(venta_id, metodo, monto) -> Pago:
    venta = venta_repository.obtener_por_id(venta_id)
    if not venta:
        raise ValueError(f"Venta {venta_id} no encontrada")
    if venta.estado == 'cancelado':
        raise ValueError("No se puede registrar un pago en una venta cancelada")

    if metodo not in METODOS_VALIDOS:
        raise ValueError(f"Método inválido, opciones: {', '.join(METODOS_VALIDOS)}")

    if float(monto) <= 0:
        raise ValueError("El monto debe ser mayor a 0")
    if float(monto) != float(venta.total):
        raise ValueError(f"El monto {monto} no coincide con el total de la venta {venta.total}")

    # Una venta no puede tener dos pagos aprobados
    pagos_existentes = pago_repository.listar_por_venta(venta_id)
    if any(p.estado == 'aprobado' for p in pagos_existentes):
        raise ValueError("Esta venta ya tiene un pago aprobado")

    return pago_repository.registrar(venta_id, metodo, monto)


def obtener_pago(pago_id) -> Pago:
    pago = pago_repository.obtener_por_id(pago_id)
    if not pago:
        raise ValueError(f"Pago {pago_id} no encontrado")
    return pago


def listar_por_venta(venta_id) -> list[Pago]:
    if not venta_repository.obtener_por_id(venta_id):
        raise ValueError(f"Venta {venta_id} no encontrada")
    return pago_repository.listar_por_venta(venta_id)


def aprobar(pago_id) -> Pago:
    pago = pago_repository.obtener_por_id(pago_id)
    if not pago:
        raise ValueError(f"Pago {pago_id} no encontrado")
    if pago.estado != 'pendiente':
        raise ValueError(f"Solo se puede aprobar un pago pendiente, estado actual: {pago.estado}")

    pago_repository.cambiar_estado(pago_id, 'aprobado')
    return pago_repository.obtener_por_id(pago_id)


def rechazar(pago_id) -> Pago:
    pago = pago_repository.obtener_por_id(pago_id)
    if not pago:
        raise ValueError(f"Pago {pago_id} no encontrado")
    if pago.estado != 'pendiente':
        raise ValueError(f"Solo se puede rechazar un pago pendiente, estado actual: {pago.estado}")

    pago_repository.cambiar_estado(pago_id, 'rechazado')
    return pago_repository.obtener_por_id(pago_id)