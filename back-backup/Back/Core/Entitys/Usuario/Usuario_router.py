from fastapi import APIRouter, HTTPException, Depends, Body
import Back.Core.Entitys.Usuario.Usuario_service as usuario_service
from Back.Infra.Utils.TOKEN import AUTH, es_propietario, es_admin

router = APIRouter(prefix="/usuario", tags=["Usuario"])


@router.get("/perfil_privado")
async def obtener_perfil(usuario: dict = Depends(AUTH)):
    resultado = await usuario_service.obtener(usuario["clerk_id"])
    if not resultado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return resultado


@router.get("/buscar")
async def buscar(busqueda: str, usuario: dict = Depends(es_admin)):
    resultado = await usuario_service.buscar(busqueda)
    if not resultado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return resultado


@router.get("/listar")
async def listar(usuario: dict = Depends(es_admin)):
    return await usuario_service.listar()


@router.get("/listar/activos")
async def listar_activos(usuario: dict = Depends(es_admin)):
    return await usuario_service.listar_activos()


@router.patch("/{usuario_id}")
async def actualizar(usuario_id: str, datos: dict = Body(...), usuario: dict = Depends(es_propietario)):
    campos = {k: v for k, v in datos.items() if v is not None}
    actualizado = usuario_service.actualizar(usuario_id, **campos)
    if not actualizado:
        raise HTTPException(status_code=400, detail="No se pudo actualizar")
    return {"detail": "Usuario actualizado"}


@router.patch("/{usuario_id}/desactivar")
async def desactivar(usuario_id: str, usuario: dict = Depends(es_propietario)):
    await usuario_service.desactivar(usuario_id)
    return {"detail": "Cuenta desactivada"}


@router.patch("/{usuario_id}/activar")
async def activar(usuario_id: str, usuario: dict = Depends(es_admin)):
    await usuario_service.activar(usuario_id)
    return {"detail": "Cuenta activada"}


@router.patch("/{usuario_id}/rol")
async def cambiar_rol(usuario_id: str, usuario: dict = Depends(es_admin)):
    try:
        await usuario_service.cambiar_rol(usuario_id)
        return {"detail": "Rol actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/{usuario_id}/nivel")
async def cambiar_nivel(usuario_id: str,nivel: str = Body(...),valido_hasta=Body(None),usuario: dict = Depends(es_admin)):
    await usuario_service.cambiar_nivel(usuario_id, nivel, valido_hasta)
    return {"detail": "Nivel actualizado"}
