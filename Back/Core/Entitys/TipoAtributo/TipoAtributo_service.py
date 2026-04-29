from Back.Core.Entitys.TipoAtributo import TipoAtributo
import Back.Core.Entitys.TipoAtributo.TipoAtributo_repo as tipo_repository


def crear_tipo(nombre) -> TipoAtributo:
    if tipo_repository.obtener_por_nombre(nombre):
        raise ValueError(f"Ya existe un tipo de atributo con nombre '{nombre}'")
    return tipo_repository.registrar(nombre)


def obtener_tipo(tipo_id) -> TipoAtributo:
    tipo = tipo_repository.obtener_por_id(tipo_id)
    if not tipo:
        raise ValueError(f"Tipo de atributo {tipo_id} no encontrado")
    return tipo


def listar_tipos() -> list[TipoAtributo]:
    return tipo_repository.listar()


def actualizar_tipo(tipo_id, nombre) -> TipoAtributo:
    if not tipo_repository.obtener_por_id(tipo_id):
        raise ValueError(f"Tipo de atributo {tipo_id} no encontrado")

    existente = tipo_repository.obtener_por_nombre(nombre)
    if existente and str(existente.id) != str(tipo_id):
        raise ValueError(f"Ya existe un tipo de atributo con nombre '{nombre}'")

    tipo_repository.actualizar(tipo_id, nombre)
    return tipo_repository.obtener_por_id(tipo_id)


def eliminar_tipo(tipo_id) -> bool:
    if not tipo_repository.obtener_por_id(tipo_id):
        raise ValueError(f"Tipo de atributo {tipo_id} no encontrado")
    try:
        return tipo_repository.eliminar(tipo_id)
    except Exception:
        raise ValueError("No se puede eliminar este tipo, está siendo usado por variantes")