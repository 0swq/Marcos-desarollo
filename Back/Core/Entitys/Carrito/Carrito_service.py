from Back.Core.Entitys.Carrito import Carrito
import Back.Core.Entitys.Carrito.Carrito_repo as carrito_repository

def crear_carrito(usuario_id) -> Carrito:
    existente = carrito_repository.obtener_activo_por_usuario(usuario_id)
    if existente:
        return existente
    return carrito_repository.registrar(usuario_id)


def obtener_carrito(carrito_id) -> Carrito:
    carrito = carrito_repository.obtener_por_id(carrito_id)
    if not carrito:
        raise ValueError(f"Carrito {carrito_id} no encontrado")
    return carrito


def obtener_carrito_activo(usuario_id) -> Carrito | None:
    return carrito_repository.obtener_activo_por_usuario(usuario_id)


def completado(carrito_id, usuario_id) -> bool:
    carrito = carrito_repository.obtener_por_id(carrito_id)
    if not carrito:
        raise ValueError(f"Carrito {carrito_id} no encontrado")
    if str(carrito.usuario.id) != str(usuario_id):
        raise PermissionError("Este carrito no es tuyo")
    if carrito.estado != 'activo':
        raise ValueError(f"Estado actual: {carrito.estado}")
    return carrito_repository.completado(carrito_id)


def abandonar(carrito_id, usuario_id) -> bool:
    carrito = carrito_repository.obtener_por_id(carrito_id)
    if not carrito:
        raise ValueError(f"Carrito {carrito_id} no encontrado")
    if str(carrito.usuario.id) != str(usuario_id):
        raise PermissionError("Este carrito no es tuyo")
    if carrito.estado != 'activo':
        raise ValueError(f"El carrito ya está {carrito.estado}")
    return carrito_repository.abandonar(carrito_id)


def eliminar(carrito_id, usuario_id) -> bool:
    carrito = carrito_repository.obtener_por_id(carrito_id)
    if not carrito:
        raise ValueError(f"Carrito {carrito_id} no encontrado")
    if str(carrito.usuario.id) != str(usuario_id):
        raise PermissionError("Este carrito no es tuyo")
    if carrito.estado == 'activo':
        raise ValueError("No se puede eliminar un carrito activo, primero abandónalo")
    return carrito_repository.eliminar(carrito_id)