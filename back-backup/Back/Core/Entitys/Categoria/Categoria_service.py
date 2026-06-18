from Back.Core.Entitys.Categoria import Categoria
import Back.Core.Entitys.Categoria.Categoria_repo as categoria_repository


def registrar_padre(nombre) -> Categoria | None:
    if not nombre or not nombre.strip():
        raise ValueError("El nombre no puede estar vacío")
    if categoria_repository.obtener_por_nombre(nombre):
        return None
    return categoria_repository.registrar_padre(nombre)


def registrar_hijo(nombre, padre_id) -> Categoria | None:
    if not nombre or not nombre.strip():
        raise ValueError("El nombre no puede estar vacío")
    padre = categoria_repository.obtener_por_id(padre_id)
    if not padre:
        raise ValueError(f"Categoría padre {padre_id} no encontrada")
    if padre.padre:
        raise ValueError("No se puede crear una subcategoría de una subcategoría")
    if categoria_repository.obtener_por_nombre(nombre):
        return None
    return categoria_repository.registrar_hijo(nombre, padre_id)


def obtener_por_id(categoria_id) -> Categoria:
    categoria = categoria_repository.obtener_por_id(categoria_id)
    if not categoria:
        raise ValueError(f"Categoría {categoria_id} no encontrada")
    return categoria


def listar_hijos_de_un_padre(padre_id) -> list[Categoria]:
    if not categoria_repository.obtener_por_id(padre_id):
        raise ValueError(f"Categoría {padre_id} no encontrada")
    return categoria_repository.listar_hijos_de_un_padre(padre_id)


def listar_padres() -> list[Categoria]:
    return categoria_repository.listar_padres()


def actualizar(categoria_id, **campos) -> Categoria:
    if not categoria_repository.obtener_por_id(categoria_id):
        raise ValueError(f"Categoría {categoria_id} no encontrada")
    campos = {k: v for k, v in campos.items() if v is not None}
    if not campos:
        return categoria_repository.obtener_por_id(categoria_id)
    if "padre" in campos:
        if str(campos["padre"]) == str(categoria_id):
            raise ValueError("Una categoría no puede ser su propio padre")
        padre = categoria_repository.obtener_por_id(campos["padre"])
        if not padre:
            raise ValueError(f"Categoría padre {campos['padre']} no encontrada")
        if padre.padre:
            raise ValueError("No se puede anidar más de dos niveles")
    categoria_repository.actualizar(categoria_id, **campos)
    return categoria_repository.obtener_por_id(categoria_id)


def cambiar_estado(categoria_id) -> bool:
    categoria = categoria_repository.obtener_por_id(categoria_id)
    if not categoria:
        raise ValueError(f"Categoría {categoria_id} no encontrada")
    for sub in categoria_repository.listar_hijos_de_un_padre(categoria_id):
        categoria_repository.cambiar_estado(sub.id)
    return categoria_repository.cambiar_estado(categoria_id)