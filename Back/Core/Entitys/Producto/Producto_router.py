import io

from dotenv import load_dotenv
from starlette.responses import FileResponse

from Back.Infra.Utils.Placeholder import generar_placeholder

load_dotenv()
import os
import random
import time
from PIL import Image
import httpx
from clerk_backend_api import Clerk
from fastapi import APIRouter, HTTPException, Depends, Body, UploadFile, File
import Back.Core.Entitys.Producto.Producto_service as producto_service
from Back.Core.Entitys.Producto.ProductoBase import ProductoBase
from Back.Core.Entitys.Producto.TipoAtributo import TipoAtributo
from Back.Core.Entitys.Producto.Variante import Variante
from Back.Core.Entitys.Producto.VarianteAtributo import VarianteAtributo
from Back.Infra.Utils.TOKEN import AUTH, es_admin

router = APIRouter(prefix="/producto", tags=["Producto"])

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FOTOS_PRODUCTOS = os.path.join(BASE_DIR, "Resources", "Fotos", "Productos_base")
FOTOS_VARIANTES = os.path.join(BASE_DIR, "Resources", "Fotos", "Variantes")


def guardar_foto(contenido: bytes, ruta: str):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    imagen = Image.open(io.BytesIO(contenido)).convert("RGB")
    imagen.save(ruta, "JPEG", quality=85)
    print(ruta)


def serializar_atributo(a):
    tipo = TipoAtributo.get_by_id(a.tipo_atributo_id)
    return {**a.__data__, "tipo_atributo": tipo.__data__}


def serializar_variante_completa(vc):
    return {
        "Variante": vc.Variante.__data__,
        "Atributos": [serializar_atributo(a) for a in vc.Atributos]
    }


def serializar_producto_completo(p):
    return {
        "ProductoBase": p.ProductoBase.__data__,
        "VariantesCompletas": [serializar_variante_completa(vc) for vc in p.VariantesCompletas]
    }


@router.get("/", response_model=None)
def listar_productos_publicos():
    productos = producto_service.obtener_productos_completos_publicos()
    return [serializar_producto_completo(p) for p in productos]


@router.get("/todos", response_model=None)
def listar_productos():
    productos = producto_service.obtener_productos_completos()
    return [serializar_producto_completo(p) for p in productos]


@router.post("/stock/solicitarCodigo")
async def solicitar_codigo_stock(usuario: dict = Depends(es_admin)):
    numero = os.getenv("NUMERO_APROBAR_STOCK", "51940061944")

    with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
        usr = clerk.users.get(user_id=usuario.get("clerk_id"))
        metadata = usr.private_metadata or {}
        otp_exp = metadata.get("otp_exp", 0)

    if int(time.time()) < otp_exp:
        return {"detail": "codigo_vigente"}

    codigo = str(random.randint(100000, 999999))
    expiracion = int(time.time()) + 1800

    with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
        clerk.users.update_metadata(
            user_id=usuario.get("clerk_id"),
            private_metadata={"otp": codigo, "otp_exp": expiracion}
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.callmebot.com/whatsapp.php",
            params={"phone": numero, "text": f"Código de aprobación de stock: {codigo}", "apikey": os.getenv("CALLMEBOT_APIKEY")}
        )
        print("callmebot:", response.status_code, response.text)

    return {"detail": "Código enviado"}


@router.get("/tipo-atributo/", response_model=None)
def listar_tipos_atributo(usuario: dict = Depends(es_admin)):
    return [t.__data__ for t in producto_service.listar_tipos_atributo()]


@router.get("/tipo-atributo/{tipo_atributo_id}", response_model=None)
def obtener_tipo_atributo(tipo_atributo_id: str):
    tipo = producto_service.obtener_tipo_atributo(tipo_atributo_id)
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo de atributo no encontrado")
    return tipo.__data__


@router.post("/tipo-atributo/", response_model=None)
def crear_tipo_atributo(nombre: str, usuario: dict = Depends(es_admin)):
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


@router.get("/variantes/{variante_id}/foto", response_model=None)
def obtener_foto_variante(variante_id: str):
    ruta = os.path.join(FOTOS_VARIANTES, f"{variante_id}.jpg")
    if not os.path.exists(ruta):
        var = producto_service.obtener_variante(variante_id)
        prod = producto_service.obtener_producto(var.producto_base)
        texto = f"{prod.nombre} {var.sku}"
        return generar_placeholder(texto)
    return FileResponse(ruta, media_type="image/jpeg")


@router.patch("/variantes/{variante_id}/foto", response_model=None)
async def actualizar_foto_variante(variante_id: str, foto: UploadFile = File(...), usuario: dict = Depends(es_admin)):
    ruta = os.path.join(FOTOS_VARIANTES, f"{variante_id}.jpg")
    guardar_foto(await foto.read(), ruta)
    return {"detail": "Foto actualizada"}


@router.patch("/variantes/{variante_id}/stock", response_model=None)
async def actualizar_stock_variante_por_id(variante_id: str, datos: dict = Body(...), usuario: dict = Depends(es_admin)):
    try:
        cantidad = datos.get("cantidad")
        codigo = datos.get("codigo")
        async with Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY")) as clerk:
            usr = clerk.users.get(user_id=usuario["clerk_id"])
            metadata = usr.private_metadata
            otp = metadata.get("otp")
            otp_exp = metadata.get("otp_exp")

            if int(time.time()) > otp_exp:
                raise HTTPException(status_code=400, detail="Código expirado")
            if codigo != otp:
                raise HTTPException(status_code=400, detail="Código incorrecto")

        if cantidad is None:
            raise HTTPException(status_code=400, detail="Campo stock requerido")
        actualizado = producto_service.actualizar_stock_variante(variante_id, cantidad=int(cantidad))
        if not actualizado:
            raise HTTPException(status_code=400, detail="No se pudo actualizar el stock")
        return {"detail": "Stock actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/variantes/{variante_id}/estado", response_model=None)
def cambiar_estado_variante(variante_id: str, usuario: dict = Depends(es_admin)):
    try:
        producto_service.cambiar_estado_producto(variante_id)
        return {"detail": "Estado actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


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


@router.get("/{producto_base_id}/foto", response_model=None)
def obtener_foto_producto_base(producto_base_id: str):
    ruta = os.path.join(FOTOS_PRODUCTOS, f"{producto_base_id}.jpg")
    if not os.path.exists(ruta):
        prod = producto_service.obtener_producto(producto_base_id)
        return generar_placeholder(prod.nombre)
    return FileResponse(ruta, media_type="image/jpeg")


@router.patch("/{producto_base_id}/foto", response_model=None)
async def actualizar_foto_producto_base(producto_base_id: str, foto: UploadFile = File(...), usuario: dict = Depends(es_admin)):
    ruta = os.path.join(FOTOS_PRODUCTOS, f"{producto_base_id}.jpg")
    guardar_foto(await foto.read(), ruta)
    return {"detail": "Foto actualizada"}


@router.patch("/{producto_base_id}/estado", response_model=None)
def cambiar_estado_producto(producto_base_id: str, usuario: dict = Depends(es_admin)):
    try:
        producto_service.cambiar_estado_producto(producto_base_id)
        return {"detail": "Estado actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{producto_base_id}/variantes", response_model=None)
def listar_variantes(producto_base_id: str, usuario: dict = Depends(es_admin)):
    try:
        return [v.__data__ for v in producto_service.listar_variantes_de_producto(producto_base_id)]
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{producto_base_id}/variantes", response_model=None)
def agregar_variante(variante: dict, usuario: dict = Depends(es_admin)):
    return producto_service.agregar_variante(Variante(**variante)).__data__


@router.get("/{producto_base_id}", response_model=None)
def obtener_producto(producto_base_id: str):
    p = producto_service.obtener_producto_completo(producto_base_id)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return serializar_producto_completo(p)


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