from fastapi import APIRouter, Depends, HTTPException, Body
import Back.Core.Entitys.Pedido.Pedido_service as pedido_service
from Back.Infra.Utils.TOKEN import AUTH

router = APIRouter(prefix="/pedido", tags=["Pedido"])
@router.post("/crear")
def crear_pedido(
    tipo_entrega: str = Body("RECOJO", embed=True),
    usuario: dict = Depends(AUTH),
):
    try:
        pedido = pedido_service.crear_desde_carrito(
            usuario["clerk_id"], tipo_entrega
        )
        return pedido.__data__
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/")
def listar_pedidos(usuario: dict = Depends(AUTH)):
    pedidos = pedido_service.listar_por_usuario(usuario["clerk_id"])
    return [p.__data__ for p in pedidos]
@router.get("/{pedido_id}")
def obtener_pedido(pedido_id: str, usuario: dict = Depends(AUTH)):
    pedido = pedido_service.obtener_por_id(pedido_id, usuario["clerk_id"])
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido.__data__
