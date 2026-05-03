
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from fastapi import Request
from Back.Core.Connection.Postgre import db
from Back.Core.Entitys.Carrito.Carrito import Carrito
from Back.Core.Entitys.CarritoItem.CarritoItem import CarritoItem
from Back.Core.Entitys.Categoria.Categoria import Categoria
from Back.Core.Entitys.Cupon.Cupon import Cupon
from Back.Core.Entitys.CuponUsuario.CuponUsuario import CuponUsuario
from Back.Core.Entitys.DetallePedido.DetallePedido import DetallePedido
from Back.Core.Entitys.Direccion.Direccion import Direccion
from Back.Core.Entitys.Pago.Pago import Pago
from Back.Core.Entitys.Producto.ProductoBase.ProductoBase import ProductoBase
from Back.Core.Entitys.Promocion.Promocion import Promocion
from Back.Core.Entitys.Proveedor.Proveedor import Proveedor
from Back.Core.Entitys.Producto.TipoAtributo import TipoAtributo
from Back.Core.Entitys.Usuario.Usuario import Usuario
from Back.Core.Entitys.Producto.Variante.Variante import Variante
from Back.Core.Entitys.Producto.VarianteAtributo import VarianteAtributo
from Back.Core.Entitys.Pedido.Pedido import Pedido

import importlib

from Back.Infra.Utils.TOKEN import ReverificationRequired

MODELS = [
    Usuario,
    Categoria,
    Proveedor,
    ProductoBase,
    TipoAtributo,
    Variante,
    VarianteAtributo,
    Direccion,
    Cupon,
    Carrito,
    CarritoItem,
    Promocion,
    Pedido,
    CuponUsuario,
    DetallePedido,
    Pago,
]
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FOTOS_PRODUCTOS = os.path.join(BASE_DIR, "Back", "Resources", "Fotos", "Productos")

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.connect()
#    db.execute_sql('DROP SCHEMA public CASCADE;')
#    db.execute_sql('CREATE SCHEMA public;')
    db.execute_sql('GRANT ALL ON SCHEMA public TO public;')
    db.create_tables(MODELS, safe=True)
    print("Iniciado")
    yield
    if not db.is_closed():
        db.close()
app = FastAPI(title="Proyecto Final", lifespan=lifespan)



@app.exception_handler(ReverificationRequired)
async def reverification_handler(request: Request, exc: ReverificationRequired):
    return JSONResponse(
        status_code=403,
        content={
            "clerk_error": {
                "type": "forbidden",
                "reason": "reverification-required",
                "metadata": {
                    "reverification": {
                        "level": "second_factor",
                        "afterMinutes": 10
                    }
                }
            }
        }
    )
for root, dirs, files in os.walk("Back"):
    dirs[:] = [d for d in dirs if d != "venv"]
    for file in files:
        if file.endswith(".py") and file != "__init__.py" and file != "tunel.py":
            module_path = os.path.join(root, file).replace(os.sep, ".").replace(".py", "")
            try:
                module = importlib.import_module(module_path)
                if hasattr(module, "router"):
                    app.include_router(module.router)
                    print(f"Router incluido: {module_path}")
            except Exception as e:
                print(f"❌ Error importando {module_path}: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)
