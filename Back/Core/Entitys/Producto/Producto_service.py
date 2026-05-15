import Back.Core.Entitys.Producto.Producto_repo as repo
from Back.Core.Entitys.Producto.ProductoBase import ProductoBase
from Back.Core.Entitys.Producto.TipoAtributo import TipoAtributo
from Back.Core.Entitys.Producto.Variante import Variante
from Back.Core.Entitys.Producto.VarianteAtributo import VarianteAtributo


# producto
def crear_producto(producto_base: ProductoBase) -> ProductoBase:
    return repo.crear_producto(producto_base)


def obtener_producto(producto_base_id: str) -> ProductoBase:
    producto = repo.obtener_producto(producto_base_id)
    if not producto:
        raise ValueError("Producto no encontrado")
    return producto


def listar_productos() -> list[ProductoBase]:
    return repo.listar_productos()


def listar_productos_publicos() -> list[ProductoBase]:
    return repo.listar_productos_publicos()


def actualizar_producto(producto_base_id: str, **campos) -> bool:
    producto = repo.obtener_producto(producto_base_id)
    if not producto:
        raise ValueError("Producto no encontrado")
    return repo.actualizar_producto(producto_base_id, **campos)


def cambiar_estado_producto(producto_base_id: str) -> bool:
    producto = repo.obtener_producto(producto_base_id)
    if not producto:
        raise ValueError("Producto no encontrado")
    return repo.cambiar_estado_producto(producto_base_id)


# variante
def agregar_variante(variante: Variante) -> Variante:
    return repo.agregar_variante(variante)


def obtener_variante(variante_id: str) -> Variante:
    variante = repo.obtener_variante(variante_id)
    if not variante:
        raise ValueError("Variante no encontrada")
    return variante


def listar_variantes_de_producto(producto_base_id: str) -> list[Variante]:
    producto = repo.obtener_producto(producto_base_id)
    if not producto:
        raise ValueError("Producto no encontrado")
    return repo.listar_variantes_de_producto(producto_base_id)


def actualizar_variante(variante_id: str, **campos) -> bool:
    variante = repo.obtener_variante(variante_id)
    if not variante:
        raise ValueError("Variante no encontrada")
    return repo.actualizar_variante(variante_id, **campos)


def actualizar_stock_variante(variante_id: str, cantidad: int) -> bool:
    variante = repo.obtener_variante(variante_id)

    if not variante:
        raise ValueError("Variante no encontrada")
    nuevo_stock = variante.stock + cantidad
    if nuevo_stock < 0:
        raise ValueError(f"Stock insuficiente. Actual: {variante.stock}")
    return repo.actualizar_variante(variante_id, stock=nuevo_stock)


def cambiar_estado_variante(variante_id: str) -> bool:
    variante = repo.obtener_variante(variante_id)
    if not variante:
        raise ValueError("Variante no encontrada")
    return repo.cambiar_estado_variante(variante_id)


# atributo
def agregar_atributo(atributo: VarianteAtributo) -> VarianteAtributo:
    return repo.agregar_atributo(atributo)


def obtener_atributo(variante_id: str, tipo_atributo_id: str) -> VarianteAtributo:
    atributo = repo.obtener_atributo(variante_id, tipo_atributo_id)
    if not atributo:
        raise ValueError("Atributo no encontrado")
    return atributo


def listar_atributos_de_variante(variante_id: str) -> list[VarianteAtributo]:
    variante = repo.obtener_variante(variante_id)
    if not variante:
        raise ValueError("Variante no encontrada")
    return repo.listar_atributos_de_variante(variante_id)


def actualizar_atributo(variante_id: str, tipo_atributo_id: str, **campos) -> bool:
    atributo = repo.obtener_atributo(variante_id, tipo_atributo_id)
    if not atributo:
        raise ValueError("Atributo no encontrado")
    return repo.actualizar_atributo(variante_id, tipo_atributo_id, **campos)


def eliminar_atributo(variante_id: str, tipo_atributo_id: str) -> bool:
    atributo = repo.obtener_atributo(variante_id, tipo_atributo_id)
    if not atributo:
        raise ValueError("Atributo no encontrado")
    return repo.eliminar_atributo(variante_id, tipo_atributo_id)


# tipo atributo
def crear_tipo_atributo(tipo_atributo: TipoAtributo) -> TipoAtributo:
    return repo.crear_tipo_atributo(tipo_atributo)


def obtener_tipo_atributo(tipo_atributo_id: str) -> TipoAtributo:
    tipo = repo.obtener_tipo_atributo(tipo_atributo_id)
    if not tipo:
        raise ValueError("Tipo de atributo no encontrado")
    return tipo


def listar_tipos_atributo() -> list[TipoAtributo]:
    return repo.listar_tipos_atributo()


def actualizar_tipo_atributo(tipo_atributo_id: str, **campos) -> bool:
    tipo = repo.obtener_tipo_atributo(tipo_atributo_id)
    if not tipo:
        raise ValueError("Tipo de atributo no encontrado")
    return repo.actualizar_tipo_atributo(tipo_atributo_id, **campos)


def obtener_productos_completos():
    return repo.obtener_productos_completos()


def obtener_productos_completos_publicos():
    return repo.obtener_productos_completos_publicos()


def obtener_producto_completo(producto_base_id: str):
    producto = repo.obtener_producto_completo(producto_base_id)
    if not producto:
        raise ValueError("Producto no encontrado")
    return producto
