from fastapi import APIRouter, Depends, HTTPException, Body
import Back.Core.Entitys.CarritoItem.CarritoItem_service as item_service
from Back.Infra.Utils.TOKEN import AUTH

router = APIRouter(prefix="/carrito/items", tags=["CarritoItem"])
@router.post("/")
def agregar_item(
    variante_id: str = Body(...),
    cantidad: int = Body(1),
    usuario: dict = Depends(AUTH),
):
    try:
        item = item_service.agregar_item(usuario["clerk_id"], variante_id, cantidad)
        return item.__data__
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.patch("/{item_id}")
def actualizar_item(
    item_id: str,
    cantidad: int = Body(..., embed=True),
    usuario: dict = Depends(AUTH),
):
    try:
        item = item_service.actualizar_cantidad(item_id, usuario["clerk_id"], cantidad)
        if item is True:
            return {"detail": "Item eliminado"}
        return item.__data__
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.delete("/{item_id}")
def eliminar_item(item_id: str, usuario: dict = Depends(AUTH)):
    try:
        item_service.eliminar_item(item_id, usuario["clerk_id"])
        return {"detail": "Item eliminado"}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/")
def listar_items(usuario: dict = Depends(AUTH)):
    items = item_service.listar_items(usuario["clerk_id"])
    resultado = []
    for it in items:
        variante = it.variante

        from Back.Core.Entitys.Producto.VarianteAtributo.VarianteAtributo import \
            VarianteAtributo
        from Back.Core.Entitys.Producto.TipoAtributo.TipoAtributo import \
            TipoAtributo
        atributos = list(
            VarianteAtributo.select(VarianteAtributo, TipoAtributo)
            .join(TipoAtributo)
            .where(VarianteAtributo.variante == variante.id)
        )
        resultado.append({
            **it.__data__,
            "variante_obj": {
                **variante.__data__,
                "atributos": [
                    {
                        **a.__data__,
                        "tipo_atributo": a.tipo_atributo.__data__,
                    }
                    for a in atributos
                ],
            },
            "producto_base": variante.producto_base.__data__,
        })
    return resultado

