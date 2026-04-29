import os
from clerk_backend_api import Clerk
import Back.Core.Entitys.Usuario.Usuario_repo as usuario_repository
from Back.Core.Entitys.Usuario.Usuario import Usuario

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))


def registrar(nombres: str, apellidos: str, email: str, password: str, rol: str = 'cliente') -> None:
    if usuario_repository.obtener_por_email(email):
        raise ValueError("El email ya está registrado")
    usuario_repository.registrar(nombres, apellidos, email, password, rol)
    )


def registrar_desde_webhook(clerk_id: str, nombres: str, apellidos: str, email: str) -> Usuario:
    if usuario_repository.obtener_por_email(email):
        raise ValueError("El email ya está registrado")
    clerk.users.create(
        email_address=[email],

        first_name=nombres,
        last_name=apellidos,
        public_metadata={
            "rol": rol
        }
    usuario_repository.registrar(nombres, apellidos, email, password, rol)


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


# ── ACTUALIZAR ────────────────────────────────────────────────────────────────

def actualizar(usuario_id, **campos) -> bool:
    """El usuario actualiza sus propios datos. BD + sincroniza Clerk."""
    campos.pop('rol', None)
    campos.pop('tipo_usuario', None)
    campos.pop('nivel', None)
    campos.pop('nivel_valido_hasta', None)
    campos.pop('activo', None)

    if not campos:
        return False

    _validar_email_unico(usuario_id, campos)
    usuario_repository.actualizar(usuario_id, **campos)
    usuario_repository.actualizar_en_clerk(usuario_id)
    return True


def actualizar_desde_webhook(usuario_id, **campos) -> bool:
    """Llamado desde webhook. Solo actualiza BD, Clerk ya tiene los datos."""
    if not campos:
        return False
    return usuario_repository.actualizar(usuario_id, **campos)


def actualizar_desde_admin(usuario_id, **campos) -> bool:
    """Admin puede cambiar cualquier campo. BD + sincroniza Clerk."""
    if not campos:
        return False

    _validar_email_unico(usuario_id, campos)
    usuario_repository.actualizar(usuario_id, **campos)
    usuario_repository.actualizar_en_clerk(usuario_id)
    return True


def cambiar_rol(usuario_id) -> bool:
    """Cambia rol entre admin y cliente. BD + sincroniza Clerk."""
    usuario = obtener(usuario_id)
    if not usuario:
        raise ValueError(f"Usuario {usuario_id} no encontrado")
    nuevo_rol = 'admin' if usuario.rol == 'cliente' else 'cliente'
    usuario_repository.actualizar(usuario_id, rol=nuevo_rol)
    usuario_repository.actualizar_en_clerk(usuario_id)
    return True


# ── DESACTIVAR ────────────────────────────────────────────────────────────────

def desactivar(usuario_id) -> bool:
    return usuario_repository.desactivar(usuario_id)


# ── HELPERS ───────────────────────────────────────────────────────────────────

def _validar_email_unico(usuario_id, campos: dict):
    if "mail" in campos and campos["mail"]:
        existente = usuario_repository.obtener_por_email(campos["mail"])
        if existente and str(existente.id) != str(usuario_id):
            raise ValueError(f"El email {campos['mail']} ya está en uso")
