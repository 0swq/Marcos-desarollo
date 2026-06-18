import json
from fastapi import APIRouter, Depends, HTTPException, Body
import Back.Core.Entitys.Pago.Pago_service as pago_service
from Back.Core.Entitys.Pedido.Pedido import Pedido
from Back.Infra.Utils.TOKEN import AUTH

router = APIRouter(prefix="/pago", tags=["Pago"])
@router.post("/crear")
def crear_pago(
    pedido_id: str = Body(...),
    metodo: str = Body("tarjeta"),
    usuario: dict = Depends(AUTH),
):
    pedido = Pedido.get_or_none(
        (Pedido.id == pedido_id) & (Pedido.usuario == usuario["clerk_id"])
    )
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    try:
        pago = pago_service.crear_pago(
            pedido_id=pedido_id,
            metodo=metodo,
            monto=float(pedido.total),
        )
        return pago.__data__
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.post("/izipay/sesion")
def crear_sesion_izipay(
    pedido_id: str = Body(...),
    usuario: dict = Depends(AUTH),
):

    pedido = Pedido.get_or_none(
        (Pedido.id == pedido_id) & (Pedido.usuario == usuario["clerk_id"])
    )
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    try:
        sesion = pago_service.generar_sesion_izipay(pedido, usuario)
        return sesion
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/izipay/callback")
async def callback_izipay(request: dict = Body(...)):

    try:
        pago_service.procesar_callback_izipay(request)
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/{pago_id}")
def obtener_pago(pago_id: str, usuario: dict = Depends(AUTH)):
    try:
        pago = pago_service.obtener_pago(pago_id)
        return pago.__data__
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

