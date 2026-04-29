from Back.Core.Entitys.ProductoBase import ProductoBase
from Back.Core.Entitys.Categoria import Categoria
from Back.Core.Entitys.Proveedor import Proveedor

def registrar(nombre, descripcion=None, marca=None, unidades='UNIDADES',
          categoria_id=None, proveedor_id=None, publicado=False) -> ProductoBase:
    return ProductoBase.create(
        nombre=nombre,
        descripcion=descripcion,
        marca=marca,
        unidades=unidades,
        categoria=categoria_id,
        proveedor=proveedor_id,
        publicado=publicado
    )


def obtener_por_id(producto_id) -> ProductoBase | None:
    return ProductoBase.get_or_none(ProductoBase.id == producto_id)


def listar_publicados() -> list[ProductoBase]:
    return list(
        ProductoBase.select(ProductoBase, Categoria, Proveedor)
        .join(Categoria, on=(ProductoBase.categoria == Categoria.id), join_type='LEFT OUTER')
        .switch(ProductoBase)
        .join(Proveedor, on=(ProductoBase.proveedor == Proveedor.id), join_type='LEFT OUTER')
        .where(ProductoBase.publicado == True)
    )


def listar_todos() -> list[ProductoBase]:
    return list(
        ProductoBase.select(ProductoBase, Categoria, Proveedor)
        .join(Categoria, on=(ProductoBase.categoria == Categoria.id), join_type='LEFT OUTER')
        .switch(ProductoBase)
        .join(Proveedor, on=(ProductoBase.proveedor == Proveedor.id), join_type='LEFT OUTER')
    )


def buscar(busqueda: str) -> list[ProductoBase]:
    return list(
        ProductoBase.select().where(
            (ProductoBase.nombre.contains(busqueda)) |
            (ProductoBase.marca.contains(busqueda))
        )
    )


def listar_por_categoria(categoria_id) -> list[ProductoBase]:
    return list(
        ProductoBase.select().where(
            (ProductoBase.categoria == categoria_id) &
            (ProductoBase.publicado == True)
        )
    )


def listar_por_proveedor(proveedor_id) -> list[ProductoBase]:
    return list(
        ProductoBase.select().where(ProductoBase.proveedor == proveedor_id)
    )


def actualizar(producto_id, **campos) -> bool:
    if not campos:
        return False
    filas = (ProductoBase.update(campos)
             .where(ProductoBase.id == producto_id)
             .execute())
    return filas > 0


def publicar(producto_id) -> bool:
    filas = (ProductoBase.update(publicado=True)
             .where(ProductoBase.id == producto_id)
             .execute())
    return filas > 0


def despublicar(producto_id) -> bool:
    filas = (ProductoBase.update(publicado=False)
             .where(ProductoBase.id == producto_id)
             .execute())
    return filas > 0


def eliminar(producto_id) -> bool:
    filas = ProductoBase.delete().where(ProductoBase.id == producto_id).execute()
    return filas > 0