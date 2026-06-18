from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

import Back.Core.Entitys.Carrito.Carrito_service as carrito_service
from Back.Infra.Utils.TOKEN import AUTH

router = APIRouter(prefix="/carrito", tags=["Carrito"])

@router.post("/")
def crear_carrito(usuario: dict = Depends(AUTH)):
    carrito = carrito_service.crear_carrito(usuario["id"])
    return carrito.__data__


@router.get("/activo")
def obtener_carrito_activo(usuario: dict = Depends(AUTH)):
    carrito = carrito_service.obtener_carrito_activo(usuario["id"])
    if not carrito:
        raise HTTPException(status_code=404, detail="No tienes un carrito activo")
    return carrito.__data__


@router.patch("/{carrito_id}/completar")
def completar_carrito(carrito_id: UUID , usuario: dict = Depends(AUTH)):
    try:
        carrito_service.completado(carrito_id, usuario["id"])
        return {"detail": "Carrito completado"}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{carrito_id}/abandonar")
def abandonar_carrito(carrito_id: UUID, usuario: dict = Depends(AUTH)):
    try:
        carrito_service.abandonar(carrito_id, usuario["id"])
        return {"detail": "Carrito abandonado"}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{carrito_id}")
def eliminar_carrito(carrito_id: UUID, usuario: dict = Depends(AUTH)):
    try:
        carrito_service.eliminar(carrito_id, usuario["id"])
        return {"detail": "Carrito eliminado"}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))