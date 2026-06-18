import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse

import Back.Core.Entitys.Replicar.Replica_service as replica_service
from Back.Infra.Utils.TOKEN import AUTH
from Back.Core.Entitys.Replicar.Replica_repo import crear
from Back.Core.Entitys.Producto.ProductoBase.ProductoBase import ProductoBase
from Back.Infra.Utils.TOKEN import es_propietario

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FOTOS_PRODUCTOS = os.path.join(BASE_DIR, "Resources", "Fotos", "Productos_base")
router = APIRouter(prefix="/replicador", tags=["replicador"])
@router.post("/replicar")
async def replicar(
        background_tasks: BackgroundTasks,
        producto_base_id: str = Form(...),
        imagen: UploadFile = File(...),
        usuario: dict = Depends(AUTH),
):
    if not imagen.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Solo se aceptan archivos de imagen")

    producto = ProductoBase.get_or_none(ProductoBase.id == producto_base_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    ruta_foto = os.path.join(FOTOS_PRODUCTOS, f"{producto_base_id}.jpg")
    print("=== DEBUG FOTOS ===")
    print("FOTOS_PRODUCTOS:", FOTOS_PRODUCTOS)
    print("Buscando:", ruta_foto)
    print("Existe carpeta:", os.path.exists(FOTOS_PRODUCTOS))
    if os.path.exists(FOTOS_PRODUCTOS):
        print("Archivos en carpeta:", os.listdir(FOTOS_PRODUCTOS))
    else:
        print("La carpeta NO existe")
    print("===================")

    if not os.path.exists(ruta_foto):
        raise HTTPException(status_code=400, detail="Este producto no tiene imagen de textura asignada")

    ruta_local, url_publica = await replica_service.guardar_upload(imagen)
    replica = crear(
        usuario_id=usuario["clerk_id"],
        producto_base_id=producto_base_id,
        imagen_original=ruta_local,
    )

    background_tasks.add_task(
        replica_service.procesar,
        str(replica.id),
        url_publica,
        producto_base_id,
    )

    return JSONResponse({
        "replica_id": str(replica.id),
        "estado": "pendiente",
        "mensaje": "Imagen en proceso, consultá el estado en unos segundos",
    })

@router.get("/estado/{replica_id}")
def estado(replica_id: str, usuario: dict = Depends(AUTH)):
    resultado = replica_service.obtener(replica_id, usuario["clerk_id"])
    if not resultado:
        raise HTTPException(status_code=404, detail="Replica no encontrada")
    return resultado
@router.get("/historial")
def historial(
        pagina: int = 1,
        por_pagina: int = 12,
        usuario: dict = Depends(AUTH),
):
    return replica_service.listar(usuario["clerk_id"], pagina, por_pagina)