import time

from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import httpx

from Back.Core.Entitys.Usuario.Usuario import Usuario
from Back.Core.Entitys.Usuario import Usuario_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
CLERK_JWKS_URL = "https://modest-narwhal-32.clerk.accounts.dev/.well-known/jwks.json"
_jwks_cache = None


class ReverificationRequired(Exception):
    pass


def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        _jwks_cache = httpx.get(CLERK_JWKS_URL).json()
    return _jwks_cache


def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            get_jwks(),
            algorithms=["RS256"],
            options={"verify_audience": False}
        )
        return payload
    except JWTError:
        return None


async def AUTH(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    clerk_id = payload.get("sub")
    usuario = await Usuario_service.obtener(usuario_id=clerk_id)

    if not usuario:
        Usuario_service.registrar(Usuario(id=clerk_id,rol="admin"))
        return {"clerk_id": clerk_id, "rol": "cliente", "payload": payload}
    if not usuario.activo:
        raise HTTPException(status_code=403, detail="Cuenta suspendida")

    return {"clerk_id": clerk_id, "rol": usuario.rol, "payload": payload}


async def es_propietario(clerk_id: str, usuario: dict = Depends(AUTH)):
    if usuario["rol"] != "admin" and usuario["clerk_id"] != clerk_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    return usuario


async def es_admin(usuario: dict = Depends(AUTH)):
    if usuario["rol"] != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    return usuario

