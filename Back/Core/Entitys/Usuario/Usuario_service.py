
import Back.Core.Entitys.Usuario.Usuario_repo as repo
from Back.Core.Entitys.Usuario.Usuario import Usuario, UsuarioCompleto


async def obtener(usuario_id: str) -> UsuarioCompleto | None:
    return await repo.obtener_por_id(usuario_id)

async def buscar(busqueda: str) -> list[UsuarioCompleto] | None:
    return await repo.buscar(busqueda)

async def listar() -> list[UsuarioCompleto]:
    return await repo.listar()

async def listar_activos() -> list[UsuarioCompleto]:
    return await repo.listar_activos()

def registrar(usuario: Usuario) -> None:
    repo.registrar(usuario)

def actualizar(usuario_id: str, **campos) -> bool:
    return repo.actualizar(usuario_id, **campos)

async def cambiar_rol(usuario_id: str) -> bool:
    usuario:UsuarioCompleto = await  repo.obtener_por_id(usuario_id)
    if not usuario:
        raise ValueError("Usuario no encontrado")

    nuevo_rol = "cliente" if usuario.rol == "admin" else "admin"
    return repo.actualizar(usuario_id, rol=nuevo_rol)

async def desactivar(usuario_id: str) -> bool:
    return repo.actualizar(usuario_id, activo=False)

async def activar(usuario_id: str) -> bool:
    return repo.actualizar(usuario_id, activo=True)

async def cambiar_nivel(usuario_id: str, nivel: str, valido_hasta=None) -> bool:
    return repo.actualizar(
        usuario_id,
        nivel=nivel,
        nivel_valido_hasta=valido_hasta
    )