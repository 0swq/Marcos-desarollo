from dotenv import load_dotenv
load_dotenv()

import os
import asyncio
from typing import List
from datetime import datetime
from clerk_backend_api import Clerk
from clerk_backend_api.models.user import User as ClerkUser
from Back.Core.Entitys.Usuario.Usuario import Usuario, UsuarioCompleto


async def _completar(usuario_clerk: ClerkUser | None, usuario_bd: Usuario | None) -> UsuarioCompleto | None:
    if not usuario_bd and usuario_clerk:
        usuario_bd = Usuario.get_or_none(Usuario.id == usuario_clerk.id)

    if not usuario_clerk and usuario_bd:
        async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
            usuario_clerk = await clerk.users.get_async(user_id=usuario_bd.id)

    if not usuario_clerk or not usuario_bd:
        return None

    return UsuarioCompleto(
        id=usuario_clerk.id,
        nombre=usuario_clerk.first_name,
        apellido=usuario_clerk.last_name,
        email=usuario_clerk.email_addresses[0].email_address,
        creado_en=datetime.fromtimestamp(usuario_clerk.created_at / 1000),
        rol=usuario_bd.rol,
        tipo_usuario=usuario_bd.tipo_usuario,
        nivel=usuario_bd.nivel,
        nivel_valido_hasta=usuario_bd.nivel_valido_hasta,
        activo=usuario_bd.activo,
    )


def registrar(usuario: Usuario) -> Usuario:
    usuario.save(force_insert=True)
    return usuario


async def buscar(busqueda: str) -> List[UsuarioCompleto] | None:
    async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
        res = await clerk.users.list_async(query=busqueda) #adicioné el _async
        if not res: return None
        resultados = await asyncio.gather(*[_completar(u, None) for u in res])
        return [r for r in resultados if r]


async def listar() -> List[UsuarioCompleto]:
    async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
        res = await clerk.users.list_async() #adicioné el _async
        if not res: return []
        resultados = await asyncio.gather(*[_completar(u, None) for u in res])
        return [r for r in resultados if r]



async def listar_activos() -> List[UsuarioCompleto]:
    usuarios = list(Usuario.select().where(Usuario.activo == True))
    if not usuarios: return []
    resultados = await asyncio.gather(*[_completar(None, u) for u in usuarios])
    return [r for r in resultados if r]


async def obtener_por_id(usuario_id: str) -> UsuarioCompleto|None:
    async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
        key = os.getenv("CLERK_SECRET_KEY")
        print(f"KEY: '{key}'")
        res = await clerk.users.get_async(user_id=usuario_id)
        if not res: return None
        return await _completar(res, None)


def actualizar(usuario_id: str, **campos) -> bool:
    if not campos:
        return False
    filas = Usuario.update(**campos).where(Usuario.id == usuario_id).execute()
    return filas > 0