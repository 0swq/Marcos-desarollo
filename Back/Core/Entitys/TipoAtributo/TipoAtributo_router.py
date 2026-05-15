from fastapi import APIRouter, HTTPException, status
import Back.Core.Entitys.TipoAtributo.TipoAtributo_service as tipo_atributo_service

router = APIRouter(prefix="/producto/tipo-atributo", tags=["TipoAtributo"])


@router.get("/{tipo_atributo_id}")
def obtener_tipo_atributo(tipo_atributo_id: str):
    try:
        tipo = tipo_atributo_service.obtener_tipo(tipo_atributo_id)
        if not tipo:
            raise ValueError(f"TipoAtributo {tipo_atributo_id} no encontrado")
        return tipo
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))