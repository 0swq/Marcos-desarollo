
from typing import List, Any

from pydantic import ConfigDict
from pydantic.v1 import BaseModel

from Back.Core.Entitys.Producto.ProductoBase import ProductoBase
from Back.Core.Entitys.Producto.TipoAtributo import TipoAtributo
from Back.Core.Entitys.Producto.Variante import Variante
from Back.Core.Entitys.Producto.VarianteAtributo import VarianteAtributo


class VarianteCompleta(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    Variante: Any
    Atributos: List[Any]


class ProductoCompleto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    ProductoBase: Any
    VariantesCompletas: List[VarianteCompleta]

#Producto
def crear_producto(productoBase:ProductoBase) -> ProductoBase:
    productoBase.save(force_insert=True)
    return productoBase

def obtener_producto(producto_base_id) -> ProductoBase|None:
    producto = ProductoBase.get_or_none(id=producto_base_id)
    if not producto:return None
    return producto

def listar_productos() -> list[ProductoBase]:
    productos = ProductoBase.select()
    if not productos:return []
    return productos

def listar_productos_publicos() -> list[ProductoBase]:
    productos = ProductoBase.select().where(ProductoBase.publicado == True)
    if not productos:return []
    return productos

def actualizar_producto(producto_base_id: str, **campos) -> bool:
    if not campos: return False
    filas = ProductoBase.update(**campos).where(ProductoBase.id == producto_base_id).execute()
    return filas > 0

def cambiar_estado_producto(producto_base_id) -> bool:
    producto_base = obtener_producto(producto_base_id=producto_base_id)
    campos={"publicado":not(producto_base.publicado)}
    return actualizar_producto(producto_base_id=producto_base_id, **campos)


#Variante
def listar_variantes_de_producto(producto_base_id)->list[Variante]:
    variantes = Variante.select().where(Variante.producto_base == producto_base_id)
    if not variantes:return []
    return variantes

def obtener_variante(variante_id) -> Variante|None:
    variante = Variante.get_or_none(id=variante_id)
    if not variante: return None
    return variante

def agregar_variante(variante:Variante) -> Variante:
    variante.save(force_insert=True)
    return variante

def actualizar_variante(variante_id, **campos) -> bool:
    if not campos: return False
    campos.pop("publicado", None)
    filas = Variante.update(**campos).where(Variante.id == variante_id).execute()
    return filas > 0

def cambiar_estado_variante(variante_id) -> bool:
    variante = obtener_variante(variante_id=variante_id)
    if not variante: return False
    filas = Variante.update(publicado=not variante.activa).where(Variante.id == variante_id).execute()
    return filas > 0

#Atributo
def obtener_atributo(variante_id, tipo_atributo_id) -> VarianteAtributo|None:
    atributo = VarianteAtributo.get_or_none(VarianteAtributo.variante == variante_id, VarianteAtributo.tipo_atributo == tipo_atributo_id)
    if not atributo: return None
    return atributo

def listar_atributos_de_variante(variante_id) -> list[VarianteAtributo]:
    atributos = VarianteAtributo.select().where(VarianteAtributo.variante == variante_id)
    if not atributos: return []
    return atributos

def agregar_atributo(atributo: VarianteAtributo) -> VarianteAtributo:
    atributo.save(force_insert=True)
    return atributo

def actualizar_atributo(variante_id, tipo_atributo_id, **campos) -> bool:
    if not campos: return False
    filas = (VarianteAtributo.update(**campos)
             .where(VarianteAtributo.variante == variante_id,
                    VarianteAtributo.tipo_atributo == tipo_atributo_id)
             .execute())
    return filas > 0

def eliminar_atributo(variante_id, tipo_atributo_id) -> bool:
    filas = (VarianteAtributo.delete()
             .where(VarianteAtributo.variante == variante_id,
                    VarianteAtributo.tipo_atributo == tipo_atributo_id)
             .execute())
    return filas > 0

#TipoAtributo
def obtener_tipo_atributo(tipo_atributo_id) -> TipoAtributo|None:
    tipo = TipoAtributo.get_or_none(id=tipo_atributo_id)
    if not tipo: return None
    return tipo

def listar_tipos_atributo() -> list[TipoAtributo]:
    tipos = TipoAtributo.select()
    if not tipos: return []
    return tipos

def crear_tipo_atributo(tipo_atributo: TipoAtributo) -> TipoAtributo:
    tipo_atributo.save(force_insert=True)
    return tipo_atributo

def actualizar_tipo_atributo(tipo_atributo_id, **campos) -> bool:
    if not campos: return False
    filas = TipoAtributo.update(**campos).where(TipoAtributo.id == tipo_atributo_id).execute()
    return filas > 0

#dto

def obtener_productos_completos():
    productos_base = listar_productos()
    variantes = Variante.select().where(Variante.producto_base.in_(productos_base))
    atributos = VarianteAtributo.select().where(VarianteAtributo.variante.in_(variantes))
    variantes_completas = list(map(lambda variante:VarianteCompleta(Variante=variante,Atributos=[atributo for atributo in atributos if atributo.variante.id==variante.id]),variantes))
    productos_completos = list(map(lambda producto_base:ProductoCompleto(ProductoBase=producto_base,VariantesCompletas=[variante for variante in variantes_completas if variante.Variante.producto_base.id==producto_base.id]),productos_base))
    return productos_completos

def obtener_productos_completos_publicos():
    productos_base = listar_productos_publicos()
    variantes = Variante.select().where(Variante.producto_base.in_(productos_base))
    atributos = VarianteAtributo.select().where(VarianteAtributo.variante.in_(variantes))
    variantes_completas = list(map(lambda variante:VarianteCompleta(Variante=variante,Atributos=[atributo for atributo in atributos if atributo.variante.id==variante.id]),variantes))
    productos_completos = list(map(lambda producto_base:ProductoCompleto(ProductoBase=producto_base,VariantesCompletas=[variante for variante in variantes_completas if variante.Variante.producto_base.id==producto_base.id]),productos_base))
    return productos_completos

def obtener_producto_completo(producto_base_id):
    producto_base = obtener_producto(producto_base_id=producto_base_id)
    if not producto_base: return None
    variantes = listar_variantes_de_producto(producto_base_id=producto_base_id)
    atributos = VarianteAtributo.select().where(VarianteAtributo.variante.in_(variantes))
    variantes_completas = list(map(lambda variante:VarianteCompleta(Variante=variante,Atributos=[atributo for atributo in atributos if atributo.variante.id==variante.id]),variantes))
    return ProductoCompleto(ProductoBase=producto_base,VariantesCompletas=variantes_completas)