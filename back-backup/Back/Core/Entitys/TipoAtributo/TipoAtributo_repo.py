from Back.Core.Entitys.TipoAtributo import TipoAtributo


def registrar(nombre) -> TipoAtributo:
    return TipoAtributo.create(nombre=nombre)


def obtener_por_id(tipo_id) -> TipoAtributo | None:
    return TipoAtributo.get_or_none(TipoAtributo.id == tipo_id)


def obtener_por_nombre(nombre: str) -> TipoAtributo | None:
    return TipoAtributo.get_or_none(TipoAtributo.nombre == nombre)


def listar() -> list[TipoAtributo]:
    return list(TipoAtributo.select())


def actualizar(tipo_id, nombre) -> bool:
    filas = (TipoAtributo.update(nombre=nombre)
             .where(TipoAtributo.id == tipo_id)
             .execute())
    return filas > 0


def eliminar(tipo_id) -> bool:
    filas = TipoAtributo.delete().where(TipoAtributo.id == tipo_id).execute()
    return filas > 0