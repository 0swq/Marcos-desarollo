import uuid
from decimal import Decimal
from Back.Core.Entitys.Pedido.Pedido import Pedido
from Back.Core.Entitys.DetallePedido.DetallePedido import DetallePedido
from Back.Core.Entitys.Carrito.Carrito import Carrito
from Back.Core.Entitys.CarritoItem.CarritoItem import CarritoItem
from Back.Core.Entitys.Producto.Variante.Variante import Variante
def registrar(usuario_id, carrito_id, cupon_id, subtotal, total, tipo_entrega) -> Pedido:
    return Pedido.create(
        id=uuid.uuid4(),
        usuario=usuario_id,
        carrito=carrito_id,
        cupon=cupon_id,
        subtotal=subtotal,
        total=total,
        tipo_entrega=tipo_entrega,
        estado='pendiente',
    )
def crear_desde_carrito(usuario_id: str, tipo_entrega: str = "RECOJO"):
    carrito = Carrito.get_or_none(
        (Carrito.usuario == usuario_id) & (Carrito.estado == 'activo')
    )
    if not carrito:
        raise ValueError("No tenés un carrito activo")

    items = list(
        CarritoItem.select(CarritoItem, Variante)
        .join(Variante)
        .where(CarritoItem.carrito == carrito.id)
    )
    if not items:
        raise ValueError("El carrito está vacío")

    subtotal = Decimal("0")
    for it in items:
        if not it.variante.activa:
            raise ValueError(f"Variante {it.variante.sku} no disponible")
        if it.variante.stock < it.cantidad:
            raise ValueError(f"Stock insuficiente para {it.variante.sku}")
        subtotal += it.precio_unitario * it.cantidad

    total = subtotal

    pedido = registrar(
        usuario_id=usuario_id,
        carrito_id=str(carrito.id),
        cupon_id=str(carrito.cupon.id) if carrito.cupon else None,
        subtotal=subtotal,
        total=total,
        tipo_entrega=tipo_entrega,
    )

    for it in items:
        DetallePedido.create(
            id=uuid.uuid4(),
            pedido=str(pedido.id),
            variante=str(it.variante.id),
            sku_ref=it.variante.sku,
            nombre_ref=it.variante.producto_base.nombre,
            cantidad=it.cantidad,
            precio_unitario=it.precio_unitario,
            descuento_unitario=it.descuento_unitario,
        )

        variante = it.variante
        variante.stock -= it.cantidad
        variante.save()

    from Back.Core.Entitys.Carrito.Carrito_repo import completado
    completado(str(carrito.id))

    return pedido
def obtener_por_id(pedido_id: str, usuario_id: str | None = None):
    pedido = Pedido.get_or_none(Pedido.id == pedido_id)
    if not pedido:
        return None
    if usuario_id and str(pedido.usuario.id) != usuario_id:
        return None
    return pedido
def listar_por_usuario(usuario_id: str):
    return list(
        Pedido.select()
        .where(Pedido.usuario == usuario_id)
        .order_by(Pedido.fecha.desc())
    )

