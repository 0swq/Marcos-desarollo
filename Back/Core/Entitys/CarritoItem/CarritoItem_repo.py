from Back.Core.Entitys.CarritoItem import CarritoItem
from Back.Core.Entitys.Variante import Variante


def agregar(carrito_id, variante_id, cantidad, precio_unitario) -> CarritoItem:
    return CarritoItem.create(carrito=carrito_id,variante=variante_id,cantidad=cantidad,precio_unitario=precio_unitario)


def obtener_por_id(item_id) -> CarritoItem | None:
    return CarritoItem.get_or_none(CarritoItem.id == item_id)


def obtener_por_carrito_y_variante(carrito_id, variante_id) -> CarritoItem | None:
    return CarritoItem.get_or_none(
        (CarritoItem.carrito == carrito_id) &
        (CarritoItem.variante == variante_id)
    )


def listar_por_carrito(carrito_id) -> list[CarritoItem]:
    return list(
        CarritoItem.select(CarritoItem, Variante).join(Variante).where(CarritoItem.carrito == carrito_id))


def actualizar_cantidad(item_id, cantidad) -> bool:
    filas = (CarritoItem.update(cantidad=cantidad).where(CarritoItem.id == item_id).execute())
    return filas > 0


def eliminar(item_id) -> bool:
    filas = CarritoItem.delete().where(CarritoItem.id == item_id).execute()
    return filas > 0


def vaciar_carrito(carrito_id) -> bool:
    filas = CarritoItem.delete().where(CarritoItem.carrito == carrito_id).execute()
    return filas > 0