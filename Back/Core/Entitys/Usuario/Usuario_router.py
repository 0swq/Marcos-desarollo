from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Body

import Back.Core.Entitys.Usuario.Usuario_service as usuario_service
from Back.Infra.Utils.TOKEN import AUTH, es_propietario, es_admin

router = APIRouter(prefix="/usuario", tags=["Usuario"])


@router.get("/perfil")
def obtener_perfil(usuario: dict = Depends(AUTH)):
    try:
        return usuario_service.obtener(usuario["id"]).__data__
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/buscar")
def buscar(busqueda: str, usuario: dict = Depends(es_admin)):
    resultado = usuario_service.buscar(busqueda)
    if not resultado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return resultado.__data__


@router.patch("/{usuario_id}")
def actualizar(usuario_id: UUID, datos: dict = Body(...), usuario: dict = Depends(es_propietario)):
    try:
        campos = {k: v for k, v in datos.items() if v is not None}
        usuario_service.actualizar(usuario_id, **campos)
        return {"detail": "Usuario actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{usuario_id}/desactivar")
def desactivar(usuario_id: UUID, usuario: dict = Depends(es_propietario)):
    try:
        usuario_service.desactivar(usuario_id)
        return {"detail": "Cuenta desactivada"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{usuario_id}/rol")
def cambiar_rol(usuario_id: UUID, usuario: dict = Depends(es_admin)):
    try:
        usuario_service.cambiar_rol(usuario_id)
        return {"detail": "Rol actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))