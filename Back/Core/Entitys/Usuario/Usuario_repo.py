from typing import List
from Back.Core.Entitys.Usuario.Usuario import Usuario


def registrar(clerk_id: str, nombres: str, apellidos: str, email: str, rol: str = 'cliente') -> Usuario:
    usuario = Usuario(
        id=clerk_id,
        mail=email,
        nombres=nombres,
        apellidos=apellidos,
        rol=rol,
    )
    usuario.save(force_insert=True)
    return usuario


def buscar(busqueda: str) -> Usuario | None:
    return Usuario.select().where(
        Usuario.nombres.contains(busqueda)
        | Usuario.apellidos.contains(busqueda)
        | Usuario.mail.contains(busqueda)
    ).first()


def listar() -> List[Usuario]:
    return list(Usuario.select())


def listar_activos() -> List[Usuario]:
    return list(Usuario.select().where(Usuario.activo == True))


def obtener_por_id(usuario_id) -> Usuario | None:
    return Usuario.get_or_none(Usuario.id == usuario_id)


def obtener_por_email(email: str) -> Usuario | None:
    return Usuario.get_or_none(Usuario.mail == email)


def actualizar(usuario_id, **campos) -> bool:
    if not campos:
        return False

    filas = Usuario.update(**campos).where(Usuario.id == usuario_id).execute()
    return filas > 0


def desactivar(usuario_id) -> bool:
    filas = Usuario.update(activo=False).where(Usuario.id == usuario_id).execute()
    return filas > 0
