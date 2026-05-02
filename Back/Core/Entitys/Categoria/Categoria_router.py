from uuid import UUID
from fastapi import APIRouter, HTTPException, Query
import Back.Core.Entitys.Categoria.Categoria_service as categoria_service

router = APIRouter(prefix="/categoria", tags=["Categoria"])


@router.post("/padre")
def registrar_padre(nombre: str):
    try:
        resultado = categoria_service.registrar_padre(nombre)
        if resultado is None:
            return {"mensaje": "Ya existe una categoría con ese nombre"}
        return resultado.__data__
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/hijo")
def registrar_hijo(nombre: str, padre_id: UUID):
    try:
        resultado = categoria_service.registrar_hijo(nombre, padre_id)
        if resultado is None:
            return {"mensaje": "Ya existe una categoría con ese nombre"}
        return resultado.__data__
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def listar_padres():
    padres = categoria_service.listar_padres()
    return list(map(lambda padre: {**padre.__data__, "hijos": [hijo.__data__ for hijo in categoria_service.listar_hijos_de_un_padre(padre.id)]}, padres))


@router.get("/{categoria_id}/hijos")
def listar_hijos(categoria_id: UUID):
    hijos = categoria_service.listar_hijos_de_un_padre(categoria_id)
    return [hijo.__data__ for hijo in hijos]


@router.patch("/{categoria_id}/estado")
def cambiar_estado(categoria_id: UUID):
    try:
        categoria_service.cambiar_estado(categoria_id)
        return {"mensaje": f"Estado de categoría {categoria_id} actualizado correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/{categoria_id}")
def actualizar(categoria_id: UUID, nombre: str = Query(None), padre: UUID = Query(None)):
    try:
        campos = {k: v for k, v in {"nombre": nombre, "padre": padre}.items() if v is not None}
        resultado = categoria_service.actualizar(categoria_id, **campos)
        return resultado.__data__
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{categoria_id}")
def obtener_por_id(categoria_id: UUID):
    try:
        return categoria_service.obtener_por_id(categoria_id).__data__
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))