from Back.Core.Entitys.Variante import Variante


def registrar(producto_base_id, sku, precio_venta, precio_minimo=None, stock=0) -> Variante:
    return Variante.create(
        producto_base=producto_base_id,
        sku=sku,
        precio_venta=precio_venta,
        precio_minimo=precio_minimo,
        stock=stock
    )


def obtener_por_id(variante_id) -> Variante | None:
    return Variante.get_or_none(
        (Variante.id == variante_id) & (Variante.activa == True)
    )


def obtener_por_sku(sku: str) -> Variante | None:
    return Variante.get_or_none(
        (Variante.sku == sku) & (Variante.activa == True)
    )


def listar_por_producto(producto_base_id) -> list[Variante]:
    return list(Variante.select().where(
        (Variante.producto_base == producto_base_id) & (Variante.activa == True)
    ))


def actualizar(variante_id, **campos) -> bool:
    if not campos:
        return False
    filas = (Variante.update(campos)
             .where(Variante.id == variante_id)
             .execute())
    return filas > 0


def actualizar_stock(variante_id, cantidad) -> bool:
    filas = (Variante.update(stock=Variante.stock + cantidad)
             .where(Variante.id == variante_id)
             .execute())
    return filas > 0


def desactivar(variante_id) -> bool:
    filas = (Variante.update(activa=False)
             .where(Variante.id == variante_id)
             .execute())
    return filas > 0