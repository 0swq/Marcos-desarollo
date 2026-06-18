from Back.Core.Entitys.Categoria import Categoria


def registrar_padre(nombre) -> Categoria:
    return Categoria.create(nombre=nombre)


def registrar_hijo(nombre, padre_id) -> Categoria:
    return Categoria.create(nombre=nombre, padre=padre_id)

def obtener_por_nombre(nombre) -> Categoria | None:
    return Categoria.get_or_none(
        (Categoria.nombre == nombre)
    )

def obtener_por_id(categoria_id) -> Categoria | None:
    return Categoria.get_or_none(
        (Categoria.id == categoria_id)
    )


def listar_hijos_de_un_padre(padre_id) -> list[Categoria]:
    return list(Categoria.select().where(
        (Categoria.padre == padre_id)
    ))


def listar_padres() -> list[Categoria]:
    padres = Categoria.select().where( (Categoria.padre.is_null()) )
    return padres if padres else []



def actualizar(categoria_id, **campos) -> bool:
    if not campos:
        return False
    filas = (Categoria.update(**campos).where(Categoria.id == categoria_id).execute())
    return filas > 0


def cambiar_estado(categoria_id) -> bool:
    categoria = Categoria.get_or_none(Categoria.id == categoria_id)
    if not categoria:
        return False
    filas = (Categoria.update(activa=not categoria.activa)
             .where(Categoria.id == categoria_id)
             .execute())
    return filas > 0