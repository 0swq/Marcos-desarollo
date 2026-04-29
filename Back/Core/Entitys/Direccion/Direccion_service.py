# Direccion_service.py

from Back.Core.Entitys.Direccion import Direccion
import Back.Core.Entitys.Direccion.Direccion_repo as direccion_repository


def _validar_pertenencia(direccion_id, usuario_id) -> Direccion:
    direccion = direccion_repository.obtener_por_id(direccion_id)
    if not direccion:
        raise ValueError(f"Dirección {direccion_id} no encontrada")
    if str(direccion.usuario.id) != str(usuario_id):
        raise PermissionError("Esta dirección no es tuya")
    return direccion


def crear_direccion(usuario_id, calle, ciudad, alias=None,
                    referencia=None, es_principal=False) -> Direccion:
    # Si es la primera dirección del usuario, forzar como principal
    existentes = direccion_repository.listar_por_usuario(usuario_id)
    if not existentes:
        es_principal = True

    if es_principal:
        direccion_repository.quitar_principal(usuario_id)

    return direccion_repository.crear(usuario_id, calle, ciudad, alias, referencia, es_principal)


def obtener_direccion(direccion_id, usuario_id) -> Direccion:
    return _validar_pertenencia(direccion_id, usuario_id)


def listar_direcciones(usuario_id) -> list[Direccion]:
    return direccion_repository.listar_por_usuario(usuario_id)


def obtener_principal(usuario_id) -> Direccion | None:
    return direccion_repository.obtener_principal(usuario_id)


def actualizar_direccion(direccion_id, usuario_id, **campos) -> Direccion:
    _validar_pertenencia(direccion_id, usuario_id)

    campos = {k: v for k, v in campos.items() if v is not None}
    if not campos:
        raise ValueError("No se enviaron campos para actualizar")
    campos.pop("es_principal", None)

    direccion_repository.actualizar(direccion_id, **campos)
    return direccion_repository.obtener_por_id(direccion_id)


def cambiar_principal(usuario_id,direccion_id) -> bool:
    return direccion_repository.cambiar_principal(usuario_id=usuario_id, direccion_id=direccion_id)


def eliminar_direccion(direccion_id, usuario_id) -> bool:
    direccion = _validar_pertenencia(direccion_id, usuario_id)

    if direccion.es_principal:
        raise ValueError("No se puede eliminar la dirección principal, primero asigna otra como principal")

    return direccion_repository.eliminar(direccion_id)