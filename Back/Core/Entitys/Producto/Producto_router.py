from typing import Any
from fastapi import APIRouter, HTTPException, Depends, Body
import Back.Core.Entitys.Producto.Producto_service as producto_service
from Back.Core.Entitys.Producto.ProductoBase import ProductoBase
from Back.Core.Entitys.Producto.TipoAtributo import TipoAtributo
from Back.Core.Entitys.Producto.Variante import Variante
from Back.Core.Entitys.Producto.VarianteAtributo import VarianteAtributo
from Back.Infra.Utils.TOKEN import AUTH, es_admin, requiere_reverificacion

router = APIRouter(prefix="/producto", tags=["Producto"])

#variante
@router.get("/", response_model=None)
def listar_productos_publicos():
    productos = producto_service.obtener_productos_completos_publicos()
    return [{"ProductoBase": p.ProductoBase.__data__, "VariantesCompletas": [{"Variante": vc.Variante.__data__, "Atributos": [a.__data__ for a in vc.Atributos]} for vc in p.VariantesCompletas]} for p in productos]


@router.get("/todos", response_model=None)
def listar_productos(usuario: dict = Depends(es_admin)):
    productos = producto_service.obtener_productos_completos()
    return [{"ProductoBase": p.ProductoBase.__data__, "VariantesCompletas": [{"Variante": vc.Variante.__data__, "Atributos": [a.__data__ for a in vc.Atributos]} for vc in p.VariantesCompletas]} for p in productos]


@router.get("/{producto_base_id}", response_model=None)
def obtener_producto(producto_base_id: str):
    try:
        p = producto_service.obtener_producto_completo(producto_base_id)
        return {"ProductoBase": p.ProductoBase.__data__, "VariantesCompletas": [{"Variante": vc.Variante.__data__, "Atributos": [a.__data__ for a in vc.Atributos]} for vc in p.VariantesCompletas]}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/", response_model=None)
def crear_producto(producto_base: dict, usuario: dict = Depends(es_admin)):
    return producto_service.crear_producto(ProductoBase(**producto_base)).__data__

@router.patch("/{producto_base_id}", response_model=None)
def actualizar_producto(producto_base_id: str, datos: dict = Body(...), usuario: dict = Depends(es_admin)):
    try:
        campos = {k: v for k, v in datos.items() if v is not None}
        actualizado = producto_service.actualizar_producto(producto_base_id, **campos)
        if not actualizado:
            raise HTTPException(status_code=400, detail="No se pudo actualizar")
        return {"detail": "Producto actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/variantes/{variante_id}/stock", response_model=None)
def actualizar_stock_variante_por_id(variante_id: str, datos: dict = Body(...), usuario: dict = Depends(requiere_reverificacion)):
    try:
        cantidad = datos.get("cantidad")
        if cantidad is None:
            raise HTTPException(status_code=400, detail="Campo stock requerido")
        actualizado = producto_service.actualizar_stock_variante(variante_id, cantidad=int(cantidad))
        if not actualizado:
            raise HTTPException(status_code=400, detail="No se pudo actualizar el stock")
        return {"detail": "Stock actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/{producto_base_id}/estado", response_model=None)
def cambiar_estado_producto(producto_base_id: str, usuario: dict = Depends(es_admin)):
    try:
        producto_service.cambiar_estado_producto(producto_base_id)
        return {"detail": "Estado actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

#variante
@router.get("/{producto_base_id}/variantes", response_model=None)
def listar_variantes(producto_base_id: str, usuario: dict = Depends(es_admin)):
    try:
        return [v.__data__ for v in producto_service.listar_variantes_de_producto(producto_base_id)]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{producto_base_id}/variantes", response_model=None)
def agregar_variante(variante: dict, usuario: dict = Depends(es_admin)):
    return producto_service.agregar_variante(Variante(**variante)).__data__

@router.patch("/variantes/{variante_id}", response_model=None)
def actualizar_variante(variante_id: str, datos: dict = Body(...), usuario: dict = Depends(es_admin)):
    try:
        campos = {k: v for k, v in datos.items() if v is not None}
        actualizado = producto_service.actualizar_variante(variante_id, **campos)
        if not actualizado:
            raise HTTPException(status_code=400, detail="No se pudo actualizar")
        return {"detail": "Variante actualizada"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/variantes/{variante_id}/estado", response_model=None)
def cambiar_estado_variante(variante_id: str, usuario: dict = Depends(es_admin)):
    try:
        producto_service.cambiar_estado_producto(variante_id) # O tu función de estado de variante
        return {"detail": "Estado actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

#atributo
@router.get("/variantes/{variante_id}/atributos", response_model=None)
def listar_atributos(variante_id: str, usuario: dict = Depends(es_admin)):
    try:
        return [a.__data__ for a in producto_service.listar_atributos_de_variante(variante_id)]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/variantes/{variante_id}/atributos", response_model=None)
def agregar_atributo(atributo: dict, usuario: dict = Depends(es_admin)):
    return producto_service.agregar_atributo(VarianteAtributo(**atributo)).__data__

@router.patch("/variantes/{variante_id}/atributos/{tipo_atributo_id}", response_model=None)
def actualizar_atributo(variante_id: str, tipo_atributo_id: str, datos: dict = Body(...), usuario: dict = Depends(es_admin)):
    try:
        campos = {k: v for k, v in datos.items() if v is not None}
        actualizado = producto_service.actualizar_atributo(variante_id, tipo_atributo_id, **campos)
        if not actualizado:
            raise HTTPException(status_code=400, detail="No se pudo actualizar")
        return {"detail": "Atributo actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/variantes/{variante_id}/atributos/{tipo_atributo_id}", response_model=None)
def eliminar_atributo(variante_id: str, tipo_atributo_id: str, usuario: dict = Depends(es_admin)):
    try:
        producto_service.eliminar_atributo(variante_id, tipo_atributo_id)
        return {"detail": "Atributo eliminado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

#tipo atributo
@router.get("/tipo-atributo/", response_model=None)
def listar_tipos_atributo(usuario: dict = Depends(es_admin)):
    return [t.__data__ for t in producto_service.listar_tipos_atributo()]

@router.post("/tipo-atributo/", response_model=None)
def crear_tipo_atributo(nombre: str , usuario: dict = Depends(es_admin)):
    return producto_service.crear_tipo_atributo(TipoAtributo(nombre=nombre)).__data__

@router.patch("/tipo-atributo/{tipo_atributo_id}", response_model=None)
def actualizar_tipo_atributo(tipo_atributo_id: str, nombre: str, usuario: dict = Depends(es_admin)):
    try:
        actualizado = producto_service.actualizar_tipo_atributo(tipo_atributo_id, nombre=nombre)
        if not actualizado:
            raise HTTPException(status_code=400, detail="No se pudo actualizar")
        return {"detail": "Tipo de atributo actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))