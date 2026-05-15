from fastapi import APIRouter, HTTPException, Depends
import Back.Core.Entitys.Pedido.Pedido_service as pedido_service
from Back.Infra.Utils.TOKEN import AUTH, es_admin

router = APIRouter(prefix="/pedido", tags=["Pedido"])


@router.get("/mis-pedidos")
def mis_pedidos(usuario: dict = Depends(AUTH)):
    """Lista todos los pedidos del usuario autenticado."""
    return pedido_service.listar_mis_pedidos(usuario["clerk_id"])


@router.get("/mis-pedidos/{pedido_id}")
def detalle_mi_pedido(pedido_id: str, usuario: dict = Depends(AUTH)):

    """Devuelve el detalle completo de un pedido del usuario autenticado."""
    resultado = pedido_service.obtener_detalle(pedido_id, usuario["clerk_id"])
    if not resultado:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return resultado


@router.get("/listar")
def listar_todos(usuario: dict = Depends(es_admin)):
    """Admin — lista todos los pedidos del sistema."""
    return pedido_service.listar_todos()


@router.get("/{pedido_id}")
def detalle_pedido(pedido_id: str, usuario: dict = Depends(es_admin)):

    """Admin — detalle de cualquier pedido."""
    resultado = pedido_service.obtener_detalle(pedido_id, usuario_id=None)
    if not resultado:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return resultado