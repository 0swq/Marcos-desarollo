import base64
import hashlib
import hmac
import json
import os
import uuid
import httpx
from datetime import datetime
from Back.Core.Entitys.Pago.Pago import Pago
from Back.Core.Entitys.Pedido.Pedido import Pedido
import Back.Core.Entitys.Pago.Pago_repo as pago_repo

METODOS_VALIDOS = ('YAPE', 'VISA', 'MASTERCARD', 'tarjeta', 'efectivo')
def crear_pago(pedido_id, metodo, monto) -> Pago:
    pedido = Pedido.get_or_none(Pedido.id == pedido_id)
    if not pedido:
        raise ValueError(f"Pedido {pedido_id} no encontrado")
    if pedido.estado == 'cancelado':
        raise ValueError("No se puede pagar un pedido cancelado")

    if metodo not in METODOS_VALIDOS:
        raise ValueError(f"Método inválido: {metodo}")

    if float(monto) <= 0:
        raise ValueError("El monto debe ser mayor a 0")

    pagos = pago_repo.listar_por_pedido(pedido_id)
    if any(p.order_status == 'PAID' for p in pagos):
        raise ValueError("Este pedido ya fue pagado")

    return pago_repo.registrar(
        pedido_id=pedido_id,
        metodo=metodo,
        monto=monto,
    )
def obtener_pago(pago_id) -> Pago:
    pago = pago_repo.obtener_por_id(pago_id)
    if not pago:
        raise ValueError(f"Pago {pago_id} no encontrado")
    return pago
def confirmar_pago(pago_id, transaction_id, respuesta_json) -> Pago:
    pago = pago_repo.obtener_por_id(pago_id)
    if not pago:
        raise ValueError(f"Pago {pago_id} no encontrado")
    if pago.order_status == 'PAID':
        raise ValueError("Este pago ya fue confirmado")

    pago_repo.actualizar_respuesta(pago_id, transaction_id, 'PAID', respuesta_json)
    return pago_repo.obtener_por_id(pago_id)
def _izipay_headers() -> dict:

    api_key = os.getenv("IZIPAY_API_KEY", "")
    secret = os.getenv("IZIPAY_SECRET_KEY", "")
    random_str = str(uuid.uuid4())[:8]
    digest = base64.b64encode(
        hmac.new(secret.encode(), random_str.encode(), hashlib.sha256).digest()
    ).decode()
    return {
        "Authorization": f"IYZWS {api_key}:{digest}",
        "x-iyzi-rnd": random_str,
        "Content-Type": "application/json",
    }
def generar_sesion_izipay(pedido: Pedido, usuario: dict) -> dict:

    order_number = pedido.id[:12].replace("-", "").upper()
    amount = str(round(float(pedido.total), 2))
    buyer_email = usuario.get("payload", {}).get("email", "cliente@aglome.pe")

    base_url = os.getenv("IZIPAY_BASE_URL", "https://sandbox-api.izipay.pe")
    url = f"{base_url}/payment/iyzipos/checkoutform/initialize/auth"

    payload = {
        "locale": "es",
        "conversationId": str(pedido.id),
        "price": amount,
        "paidPrice": amount,
        "currency": "PEN",
        "basketId": order_number,
        "paymentGroup": "PRODUCT",
        "callbackUrl": f"{os.getenv('BASE_URL', 'http://localhost:8000')}/pago/izipay/callback",
        "enabledInstallments": [1],
        "buyer": {
            "id": str(pedido.usuario.id),
            "name": "Cliente",
            "surname": "Aglome",
            "email": buyer_email,
            "identityNumber": "00000000",
            "registrationAddress": "Perú",
            "city": "Chimbote",
            "country": "PE",
        },
        "billingAddress": {
            "contactName": "Cliente Aglome",
            "city": "Chimbote",
            "country": "PE",
        },
        "basketItems": [
            {
                "id": str(pedido.id),
                "name": f"Pedido Aglome {order_number}",
                "category1": "Materiales",
                "itemType": "PHYSICAL",
                "price": amount,
            }
        ],
    }

    try:
        resp = httpx.post(url, headers=_izipay_headers(), json=payload, timeout=30)
        if resp.status_code != 200:
            raise Exception(f"Izipay token error: {resp.text[:500]}")
        data = resp.json()

        return {
            "token": data.get("token", ""),
            "checkoutFormContent": data.get("checkoutFormContent", ""),
            "tokenExpireTime": data.get("tokenExpireTime", ""),
        }
    except httpx.ConnectError:

        demo_token = base64.b64encode(f"demo_{pedido.id}_{datetime.now()}".encode()).decode()
        return {
            "token": demo_token,
            "checkoutFormContent": "",
            "tokenExpireTime": "",
            "demo": True,
        }
def procesar_callback_izipay(data: dict):

    order_number = data.get("basketId", "")
    status = data.get("paymentStatus", "")
    transaction_id = data.get("paymentId", "")

    pago = Pago.get_or_none(Pago.order_number == order_number)
    if not pago:
        return

    nuevo_estado = {
        "SUCCESS": "PAID",
        "FAILURE": "UNPAID",
    }.get(status, "UNKNOWN")

    pago_repo.actualizar_respuesta(
        str(pago.id),
        transaction_id=transaction_id,
        order_status=nuevo_estado,
        respuesta_json=json.dumps(data),
    )
def rechazar_pago(pago_id) -> Pago:
    pago = pago_repo.obtener_por_id(pago_id)
    if not pago:
        raise ValueError(f"Pago {pago_id} no encontrado")
    if pago.order_status == 'PAID':
        raise ValueError("No se puede rechazar un pago ya confirmado")

    pago_repo.actualizar_estado(pago_id, 'UNPAID')
    return pago_repo.obtener_por_id(pago_id)

