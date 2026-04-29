from fastapi import APIRouter, Request, HTTPException, Header
from svix.webhooks import Webhook, WebhookVerificationError
import os

import Back.Core.Entitys.Usuario.Usuario_service as usuario_service

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/clerk")
async def clerk_webhook(request: Request,svix_id: str = Header(None),svix_timestamp: str = Header(None),
    svix_signature: str = Header(None),
):
    payload = await request.body()

    wh = Webhook(os.getenv("CLERK_WEBHOOK_SECRET"))
    try:
        evento = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        })

    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Firma inválida")

    tipo = evento["type"]
    data = evento["data"]

    if tipo == "user.created":
        usuario_service.registrar_desde_webhook(
            clerk_id=data.get("id"),
            nombres=data.get("first_name") or "",
            apellidos=data.get("last_name") or "",
            email=data["email_addresses"][0]["email_address"],
        )

    elif tipo == "user.updated":
        campos = {}
        if data.get("first_name") is not None:
            campos["nombres"] = data["first_name"]
        if data.get("last_name") is not None:
            campos["apellidos"] = data["last_name"]
        if data.get("email_addresses"):
            campos["mail"] = data["email_addresses"][0]["email_address"]

        usuario_service.actualizar_desde_webhook(data.get("id"), **campos)

    elif tipo == "user.deleted":
        usuario_service.desactivar(usuario_id=data.get("id"))

    return {"ok": True}