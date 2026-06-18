from Back.Core.Entitys.ProductoBase import ProductoBase
import Back.Core.Entitys.ProductoBase.ProductoBase_repo as producto_repository
import Back.Core.Entitys.Categoria.Categoria_repo as categoria_repository
import Back.Core.Entitys.Proveedor.Proveedor_repo as proveedor_repository
import Back.Core.Entitys.Variante.Variante_repo as variante_repository


def _validar_relaciones(categoria_id=None, proveedor_id=None):
    if categoria_id:
        if not categoria_repository.obtener_por_id(categoria_id):
            raise ValueError(f"Categoría {categoria_id} no encontrada")
    if proveedor_id:
        if not proveedor_repository.obtener_por_id(proveedor_id):
            raise ValueError(f"Proveedor {proveedor_id} no encontrado")


def crear_producto(nombre, descripcion=None, marca=None, unidades='UNIDADES',
                   categoria_id=None, proveedor_id=None) -> ProductoBase:
    _validar_relaciones(categoria_id, proveedor_id)
    return producto_repository.registrar(
        nombre, descripcion, marca, unidades, categoria_id, proveedor_id
    )


def obtener_producto(producto_id) -> ProductoBase:
    producto = producto_repository.obtener_por_id(producto_id)
    if not producto:
        raise ValueError(f"Producto {producto_id} no encontrado")
    return producto


def listar_publicados() -> list[ProductoBase]:
    return producto_repository.listar_publicados()


def listar_todos() -> list[ProductoBase]:
    return producto_repository.listar_todos()


def buscar_productos(busqueda: str) -> list[ProductoBase]:
    if not busqueda or len(busqueda) < 2:
        raise ValueError("La búsqueda debe tener al menos 2 caracteres")
    return producto_repository.buscar(busqueda)


def listar_por_categoria(categoria_id) -> list[ProductoBase]:
    if not categoria_repository.obtener_por_id(categoria_id):
        raise ValueError(f"Categoría {categoria_id} no encontrada")
    return producto_repository.listar_por_categoria(categoria_id)


def listar_por_proveedor(proveedor_id) -> list[ProductoBase]:
    if not proveedor_repository.obtener_por_id(proveedor_id):
        raise ValueError(f"Proveedor {proveedor_id} no encontrado")
    return producto_repository.listar_por_proveedor(proveedor_id)


def actualizar_producto(producto_id, **campos) -> ProductoBase:
    if not producto_repository.obtener_por_id(producto_id):
        raise ValueError(f"Producto {producto_id} no encontrado")

    campos = {k: v for k, v in campos.items() if v is not None}
    if not campos:
        raise ValueError("No se enviaron campos para actualizar")

    _validar_relaciones(
        campos.get("categoria_id"),
        campos.get("proveedor_id")
    )

    producto_repository.actualizar(producto_id, **campos)
    return producto_repository.obtener_por_id(producto_id)


def publicar_producto(producto_id) -> bool:
    producto = producto_repository.obtener_por_id(producto_id)
    if not producto:
        raise ValueError(f"Producto {producto_id} no encontrado")

    variantes = variante_repository.listar_por_producto(producto_id)
    if not variantes:
        raise ValueError("No se puede publicar un producto sin variantes")

    if producto.publicado:
        raise ValueError("El producto ya está publicado")

    return producto_repository.publicar(producto_id)


def despublicar_producto(producto_id) -> bool:
    producto = producto_repository.obtener_por_id(producto_id)
    if not producto:
        raise ValueError(f"Producto {producto_id} no encontrado")
    if not producto.publicado:
        raise ValueError("El producto ya está despublicado")
    return producto_repository.despublicar(producto_id)


def eliminar_producto(producto_id) -> bool:
    producto = producto_repository.obtener_por_id(producto_id)
    if not producto:
        raise ValueError(f"Producto {producto_id} no encontrado")
    if producto.publicado:
        raise ValueError("No se puede eliminar un producto publicado, primero despublícalo")
    return producto_repository.eliminar(producto_id)