from Back.Core.Entitys.Carrito import Carrito
from clerk_backend_api import Clerk


def registrar(usuario_id, estado='activo') -> Carrito:
    return Carrito.create(usuario=usuario_id, estado=estado)


def obtener_por_id(carrito_id) -> Carrito | None:
    return Carrito.get_or_none(Carrito.id == carrito_id)


def obtener_activo_por_usuario(usuario_id) -> Carrito | None:
    return Carrito.get_or_none((Carrito.usuario == usuario_id) & (Carrito.estado == 'activo'))


def cambiar_estado(carrito_id, nuevo_estado: str) -> bool:
    filas = (Carrito.update(estado=nuevo_estado).where(Carrito.id == carrito_id).execute())
    return filas > 0


def completado(carrito_id) -> bool:
    return cambiar_estado(carrito_id, 'completado')


def abandonar(carrito_id) -> bool:
    return cambiar_estado(carrito_id, 'abandonado')


