import base64
import io
import os
import uuid
import httpx
from pathlib import Path
from PIL import Image
from fastapi import UploadFile

from Back.Core.Entitys.Replicar.Replica import Replica, ReplicaDetalle
import Back.Core.Entitys.Replicar.Replica_repo as repo
from Back.Core.Entitys.Producto.ProductoBase import ProductoBase

from dotenv import load_dotenv

load_dotenv()

STABILITY_KEY = os.getenv("STABILITY_API_KEY")
STABILITY_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3"

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
UPLOAD_DIR = Path("media/uploads")
RESULTADO_DIR = Path("media/replicas")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULTADO_DIR.mkdir(parents=True, exist_ok=True)
async def guardar_upload(file: UploadFile) -> tuple[str, str]:
    ext = Path(file.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    ruta = UPLOAD_DIR / filename
    contenido = await file.read()
    ruta.write_bytes(contenido)
    mime = file.content_type or "image/jpeg"
    b64 = base64.b64encode(contenido).decode()
    url_publica = f"data:{mime};base64,{b64}"
    return str(ruta), url_publica
def _data_url_a_pil(data_url: str) -> Image.Image:
    _, b64 = data_url.split(",", 1)
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
async def _fusionar_y_guardar(
    url_imagen_base: str, producto_base_id: str, replica_id: str
) -> Path:

    from Back.Core.Entitys.Producto.Producto_router import FOTOS_PRODUCTOS

    img_ambiente = _data_url_a_pil(url_imagen_base)
    ruta_textura = Path(FOTOS_PRODUCTOS) / f"{producto_base_id}.jpg"

    if ruta_textura.exists():
        img_textura = Image.open(ruta_textura).convert("RGB")
    else:
        img_textura = img_ambiente

    alto = max(img_ambiente.height, img_textura.height)
    img_ambiente = img_ambiente.resize(
        (int(img_ambiente.width * alto / img_ambiente.height), alto), Image.LANCZOS
    )
    img_textura = img_textura.resize(
        (int(img_textura.width * alto / img_textura.height), alto), Image.LANCZOS
    )

    fusion = Image.new("RGB", (img_ambiente.width + img_textura.width, alto))
    fusion.paste(img_ambiente, (0, 0))
    fusion.paste(img_textura, (img_ambiente.width, 0))

    ruta = UPLOAD_DIR / f"{replica_id}_fusion.jpg"
    fusion.save(str(ruta), format="JPEG", quality=90)
    return ruta
async def procesar(replica_id: str, url_imagen_base: str, producto_base_id: str) -> None:

    try:
        repo.actualizar(replica_id, estado='procesando')

        producto = ProductoBase.get_or_none(ProductoBase.id == producto_base_id)
        if not producto:
            raise Exception("Producto no encontrado")

        nombre_producto = producto.nombre or "wood melamine panel"
        descripcion_texto = producto.descripcion or "smooth matte finish"

        ruta_fusion = await _fusionar_y_guardar(
            url_imagen_base, producto_base_id, replica_id
        )

        prompt = (
            f"The input image has two parts side by side: LEFT = real room photo with "
            f"furniture, RIGHT = '{nombre_producto}' melamine texture sample "
            f"({descripcion_texto}). "
            f"Edit the LEFT room: apply the exact color, texture pattern and material "
            f"finish from the RIGHT sample to all visible furniture surfaces (shelves, "
            f"cabinets, wardrobes, panels). "
            f"Keep walls, floor, ceiling, lighting, shadows, objects, layout and "
            f"perspective exactly the same. Only furniture surface material changes. "
            f"Output only the edited room photo (crop out the right reference panel). "
            f"Photorealistic."
        )

        repo.actualizar(replica_id, prompt_usado=prompt)

        async with httpx.AsyncClient(timeout=180) as client:
            with open(ruta_fusion, "rb") as f:
                resp = await client.post(
                    STABILITY_URL,
                    headers={
                        "Authorization": f"Bearer {STABILITY_KEY}",
                        "Accept": "image/*",
                    },
                    data={
                        "prompt": prompt,
                        "mode": "image-to-image",
                        "strength": 0.35,
                        "output_format": "png",
                    },
                    files={"image": ("fusion.jpg", f, "image/jpeg")},
                )

        if resp.status_code != 200:
            detail = resp.text[:800]
            raise Exception(f"Stability respondió {resp.status_code}: {detail}")

        ruta_resultado = RESULTADO_DIR / f"{replica_id}.png"
        ruta_resultado.write_bytes(resp.content)
        repo.actualizar(replica_id, estado='listo', imagen_resultado=str(ruta_resultado))

        try:
            ruta_fusion.unlink()
        except Exception:
            pass

    except Exception as e:
        repo.actualizar(replica_id, estado='error')
        print(f"[ERROR Replica_service] replica_id={replica_id} → {e}")
def obtener(replica_id: str, usuario_id: str) -> ReplicaDetalle | None:
    r = repo.obtener_por_id(replica_id, usuario_id)
    if not r:
        return None
    return _a_detalle(r)
def listar(usuario_id: str, pagina: int = 1, por_pagina: int = 12) -> dict:
    registros, total = repo.listar(usuario_id, pagina, por_pagina)
    return {
        "items": [_a_detalle(r) for r in registros],
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "paginas": -(-total // por_pagina),
    }
def _a_detalle(r: Replica) -> ReplicaDetalle:
    detalle = ReplicaDetalle(
        id=str(r.id),
        usuario_id=str(r.usuario.id),
        producto_base_id=str(r.producto.id),
        producto_nombre=r.producto.nombre,
        imagen_original=r.imagen_original,
        imagen_resultado=r.imagen_resultado,
        estado=r.estado,
        replicate_id=r.replicate_id,
        prompt_usado=r.prompt_usado,
        created_at=r.created_at,
    )
    if r.imagen_original:
        detalle.url_original = f"{BASE_URL}/media/uploads/{Path(r.imagen_original).name}"
    if r.imagen_resultado:
        detalle.url_resultado = f"{BASE_URL}/media/replicas/{Path(r.imagen_resultado).name}"
    return detalle

