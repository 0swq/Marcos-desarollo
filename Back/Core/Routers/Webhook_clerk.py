from fastapi import APIRouter, Request, HTTPException, Header
from svix.webhooks import Webhook, WebhookVerificationError
import os
from clerk_backend_api import Clerk
import Back.Core.Entitys.Usuario.Usuario_service as usuario_service
from Back.Core.Entitys.Usuario.Usuario import Usuario

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/clerk")
async def clerk_webhook(
    request: Request,
    svix_id: str = Header(None),
    svix_timestamp: str = Header(None),
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
        async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
            res = await clerk.users.get_async(user_id=data["id"])
            usuario = Usuario(
                id=res.id,
                mail=res.email_addresses[0].email_address,
                nombres=res.first_name,
                apellidos=res.last_name,
                usuario=res.username,
                creado_en=res.created_at,
            )
            usuario_service.registrar(usuario)

            await clerk.users.update_async(
                user_id=res.id,
                public_metadata={
                    "rol": usuario.rol,
                    "tipo_usuario": usuario.tipo_usuario,
                    "activo": True,
                    "nivel": None,
                    "nivel_valido_hasta": None,
                }
            )

    elif tipo == "user.updated":
        async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
            res = await clerk.users.get_async(user_id=data["id"])
            campos = {
                "nombres": res.first_name,
                "apellidos": res.last_name,
                "usuario": res.username,
                "mail": res.email_addresses[0].email_address,
            }
            usuario_service.actualizar_desde_hook(usuario_id=data["id"], **campos)

    elif tipo == "user.deleted":
        await usuario_service.desactivar(usuario_id=data.get("id"))

    return {"ok": True}