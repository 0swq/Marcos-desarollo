from Back.Core.Entitys.Categoria import Categoria


def registrar(nombre, padre_id=None) -> Categoria:
    return Categoria.create(nombre=nombre, padre=padre_id)

def obtener_por_id(categoria_id) -> Categoria | None:
    return Categoria.get_or_none(
        (Categoria.id == categoria_id) & (Categoria.activa == True)
    )

def listar_raices() -> list[Categoria]:
    return list(Categoria.select().where(
        (Categoria.padre.is_null()) & (Categoria.activa == True)
    ))


def listar_por_padre(padre_id) -> list[Categoria]:
    return list(Categoria.select().where(
        (Categoria.padre == padre_id) & (Categoria.activa == True)
    ))


def listar_todas() -> list[Categoria]:
    return list(Categoria.select().where(Categoria.activa == True))


def actualizar(categoria_id, **campos) -> bool:
    if not campos:
        return False
    filas = (Categoria.update(campos)
             .where(Categoria.id == categoria_id)
             .execute())
    return filas > 0


def desactivar(categoria_id) -> bool:
    filas = (Categoria.update(activa=False)
             .where(Categoria.id == categoria_id)
             .execute())
    return filas > 0