from Back.Core.Entitys.Categoria import Categoria
import Back.Core.Entitys.Categoria.Categoria_repo as categoria_repository


def crear_categoria(nombre, padre_id=None) -> Categoria:
    if padre_id:
        padre = categoria_repository.obtener_por_id(padre_id)
        if not padre:
            raise ValueError(f"Categoría padre {padre_id} no encontrada")
        if padre.padre:
            raise ValueError("No se puede crear una subcategoría de una subcategoría")

    return categoria_repository.registrar(nombre, padre_id)


def obtener_categoria(categoria_id) -> Categoria:
    categoria = categoria_repository.obtener_por_id(categoria_id)
    if not categoria:
        raise ValueError(f"Categoría {categoria_id} no encontrada")
    return categoria


def listar_raices() -> list[Categoria]:
    return categoria_repository.listar_raices()


def listar_subcategorias(padre_id) -> list[Categoria]:
    if not categoria_repository.obtener_por_id(padre_id):
        raise ValueError(f"Categoría {padre_id} no encontrada")
    return categoria_repository.listar_por_padre(padre_id)


def listar_todas() -> list[Categoria]:
    return categoria_repository.listar_todas()


def actualizar_categoria(categoria_id, **campos) -> Categoria:
    if not categoria_repository.obtener_por_id(categoria_id):
        raise ValueError(f"Categoría {categoria_id} no encontrada")

    campos = {k: v for k, v in campos.items() if v is not None}
    if not campos:
        raise ValueError("No se enviaron campos para actualizar")

    if "padre_id" in campos:
        if str(campos["padre_id"]) == str(categoria_id):
            raise ValueError("Una categoría no puede ser su propio padre")
        padre = categoria_repository.obtener_por_id(campos["padre_id"])
        if not padre:
            raise ValueError(f"Categoría padre {campos['padre_id']} no encontrada")
        if padre.padre:
            raise ValueError("No se puede anidar más de dos niveles")

    categoria_repository.actualizar(categoria_id, **campos)
    return categoria_repository.obtener_por_id(categoria_id)


def desactivar_categoria(categoria_id) -> bool:
    categoria = categoria_repository.obtener_por_id(categoria_id)
    if not categoria:
        raise ValueError(f"Categoría {categoria_id} no encontrada")

    subcategorias = categoria_repository.listar_por_padre(categoria_id)
    for sub in subcategorias:
        categoria_repository.desactivar(sub.id)

    return categoria_repository.desactivar(categoria_id)