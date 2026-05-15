from fastapi import APIRouter, HTTPException, Depends
import Back.Core.Entitys.Promocion.Promocion_service as promocion_service
from Back.Core.Entitys.Promocion.Promocion import PromocionCreate, PromocionUpdate
from Back.Infra.Utils.TOKEN import es_admin

router = APIRouter(prefix="/promocion", tags=["Promocion"])


@router.get("/")
def listar(usuario: dict = Depends(es_admin)):
    return promocion_service.listar()


@router.get("/{promocion_id}")
def obtener(promocion_id: str, usuario: dict = Depends(es_admin)):
    resultado = promocion_service.obtener(promocion_id)
    if not resultado:
        raise HTTPException(status_code=404, detail="Promoción no encontrada")
    return resultado


@router.post("/")
def crear(datos: PromocionCreate, usuario: dict = Depends(es_admin)):
    return promocion_service.crear(datos)


@router.patch("/{promocion_id}")
def actualizar(promocion_id: str, datos: PromocionUpdate, usuario: dict = Depends(es_admin)):
    resultado = promocion_service.actualizar(promocion_id, datos)
    if not resultado:
        raise HTTPException(status_code=404, detail="Promoción no encontrada")
    return resultado


@router.patch("/{promocion_id}/estado")
def cambiar_estado(promocion_id: str, usuario: dict = Depends(es_admin)):
    resultado = promocion_service.cambiar_estado(promocion_id)
    if not resultado:
        raise HTTPException(status_code=404, detail="Promoción no encontrada")
    return resultado


@router.delete("/{promocion_id}")
def eliminar(promocion_id: str, usuario: dict = Depends(es_admin)):
    eliminado = promocion_service.eliminar(promocion_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Promoción no encontrada")
    return {"detail": "Promoción eliminada"}