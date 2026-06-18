from Back.Core.Entitys.Variante import Variante
import Back.Core.Entitys.Variante.Variante_repo as variante_repository
import Back.Core.Entitys.ProductoBase.ProductoBase_repo as producto_repository


def crear_variante(producto_base_id, sku, precio_venta,
                   precio_minimo=None, stock=0) -> Variante:
    producto = producto_repository.obtener_por_id(producto_base_id)
    if not producto:
        raise ValueError(f"Producto {producto_base_id} no encontrado")

    if variante_repository.obtener_por_sku(sku):
        raise ValueError(f"SKU {sku} ya está en uso")

    if precio_minimo and precio_minimo > precio_venta:
        raise ValueError("El precio mínimo no puede ser mayor al precio de venta")

    return variante_repository.registrar(producto_base_id, sku, precio_venta, precio_minimo, stock)


def obtener_variante(variante_id) -> Variante:
    variante = variante_repository.obtener_por_id(variante_id)
    if not variante:
        raise ValueError(f"Variante {variante_id} no encontrada")
    return variante


def obtener_por_sku(sku: str) -> Variante:
    variante = variante_repository.obtener_por_sku(sku)
    if not variante:
        raise ValueError(f"SKU {sku} no encontrado")
    return variante


def listar_por_producto(producto_base_id) -> list[Variante]:
    if not producto_repository.obtener_por_id(producto_base_id):
        raise ValueError(f"Producto {producto_base_id} no encontrado")
    return variante_repository.listar_por_producto(producto_base_id)


def actualizar_variante(variante_id, **campos) -> Variante:
    if not variante_repository.obtener_por_id(variante_id):
        raise ValueError(f"Variante {variante_id} no encontrada")

    campos = {k: v for k, v in campos.items() if v is not None}
    if not campos:
        raise ValueError("No se enviaron campos para actualizar")

    if "sku" in campos:
        existente = variante_repository.obtener_por_sku(campos["sku"])
        if existente and str(existente.id) != str(variante_id):
            raise ValueError(f"SKU {campos['sku']} ya está en uso")

    if "precio_minimo" in campos and "precio_venta" in campos:
        if campos["precio_minimo"] > campos["precio_venta"]:
            raise ValueError("El precio mínimo no puede ser mayor al precio de venta")

    variante_repository.actualizar(variante_id, **campos)
    return variante_repository.obtener_por_id(variante_id)


def ajustar_stock(variante_id, cantidad) -> Variante:
    variante = variante_repository.obtener_por_id(variante_id)
    if not variante:
        raise ValueError(f"Variante {variante_id} no encontrada")
    if variante.stock + cantidad < 0:
        raise ValueError(f"Stock insuficiente, disponible: {variante.stock}")

    variante_repository.actualizar_stock(variante_id, cantidad)
    return variante_repository.obtener_por_id(variante_id)


def desactivar_variante(variante_id) -> bool:
    if not variante_repository.obtener_por_id(variante_id):
        raise ValueError(f"Variante {variante_id} no encontrada")
    return variante_repository.desactivar(variante_id)