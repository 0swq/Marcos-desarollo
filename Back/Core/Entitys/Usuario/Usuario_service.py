import os
from clerk_backend_api import Clerk
import Back.Core.Entitys.Usuario.Usuario_repo as usuario_repository
from Back.Core.Entitys.Usuario.Usuario import Usuario


def registrar(usuario: Usuario) -> None:
    if usuario_repository.obtener_por_email(usuario.mail):
        raise ValueError("El email ya está registrado")
    usuario_repository.registrar(usuario)


def obtener(usuario_id) -> Usuario | None:
    return usuario_repository.obtener_por_id(usuario_id)


def obtener_por_email(email: str) -> Usuario | None:
    return usuario_repository.obtener_por_email(email)


def buscar(busqueda: str) -> Usuario | None:
    return usuario_repository.buscar(busqueda)


def listar() -> list[Usuario]:
    return usuario_repository.listar()


def listar_activos() -> list[Usuario]:
    return usuario_repository.listar_activos()


def actualizar_desde_hook(usuario_id, **campos) -> bool:
    campos.pop('rol', None)
    campos.pop('tipo_usuario', None)
    campos.pop('nivel', None)
    campos.pop('nivel_valido_hasta', None)

    if not campos:
        return False

    if "mail" in campos and usuario_repository.obtener_por_email(campos["mail"]):
        return False

    usuario_repository.actualizar(usuario_id, **campos)
    return True


async def actualizar(usuario_id, **campos) -> bool:
    campos.pop('rol', None)
    campos.pop('tipo_usuario', None)
    campos.pop('nivel', None)
    campos.pop('nivel_valido_hasta', None)

    if not campos:
        return False

    await actualizar_clerk(usuario_id, **campos)
    return True


async def actualizar_clerk(usuario_id, **campos) -> bool:
    if "mail" in campos and usuario_repository.obtener_por_email(campos["mail"]):
        return False

    usuario_repository.actualizar(usuario_id, **campos)
    usuario = usuario_repository.obtener_por_id(usuario_id)

    async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
        await clerk.users.update_async(
            user_id=usuario.id,
            first_name=usuario.nombres,
            last_name=usuario.apellidos,
            username=usuario.usuario,
            public_metadata={
                "rol": usuario.rol,
                "tipo_usuario": usuario.tipo_usuario,
                "activo": usuario.activo,
                "nivel": usuario.nivel,
                "nivel_valido_hasta": str(usuario.nivel_valido_hasta) if usuario.nivel_valido_hasta else None,
            }
        )
    return True


async def actualizar_desde_admin(usuario_id, **campos) -> bool:
    await actualizar_clerk(usuario_id, **campos)
    return True


async def cambiar_rol(usuario_id) -> bool:
    usuario = usuario_repository.obtener_por_id(usuario_id)
    data = {"rol": "cliente" if usuario.rol == "admin" else "admin"}
    await actualizar_clerk(usuario_id=usuario_id, **data)
    return True


async def desactivar(usuario_id) -> bool:
    campos = {"activo": False}
    return await actualizar_desde_admin(usuario_id=usuario_id, **campos)


def _validar_email_unico(usuario_id, campos: dict):
    if "mail" in campos and campos["mail"]:
        existente = usuario_repository.obtener_por_email(campos["mail"])
        if existente and str(existente.id) != str(usuario_id):
            raise ValueError(f"El email {campos['mail']} ya está en uso")