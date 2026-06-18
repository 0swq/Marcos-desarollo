from Back.Core.Entitys.VarianteAtributo import VarianteAtributo
import Back.Core.Entitys.VarianteAtributo.VarianteAtributo_repo as atributo_repository
import Back.Core.Entitys.Variante.Variante_repo as variante_repository
import Back.Core.Entitys.TipoAtributo.TipoAtributo_repo as tipo_repository


def agregar_atributo(variante_id, tipo_atributo_id, valor) -> VarianteAtributo:
    if not variante_repository.obtener_por_id(variante_id):
        raise ValueError(f"Variante {variante_id} no encontrada")
    if not tipo_repository.obtener_por_id(tipo_atributo_id):
        raise ValueError(f"Tipo de atributo {tipo_atributo_id} no encontrado")

    if atributo_repository.obtener(variante_id, tipo_atributo_id):
        raise ValueError("Esta variante ya tiene ese atributo, usa actualizar")

    return atributo_repository.agregar(variante_id, tipo_atributo_id, valor)


def listar_atributos(variante_id) -> list[VarianteAtributo]:
    if not variante_repository.obtener_por_id(variante_id):
        raise ValueError(f"Variante {variante_id} no encontrada")
    return atributo_repository.listar_por_variante(variante_id)


def actualizar_atributo(variante_id, tipo_atributo_id, valor) -> VarianteAtributo:
    if not atributo_repository.obtener(variante_id, tipo_atributo_id):
        raise ValueError("Este atributo no existe en la variante")

    atributo_repository.actualizar(variante_id, tipo_atributo_id, valor)
    return atributo_repository.obtener(variante_id, tipo_atributo_id)


def eliminar_atributo(variante_id, tipo_atributo_id) -> bool:
    if not atributo_repository.obtener(variante_id, tipo_atributo_id):
        raise ValueError("Este atributo no existe en la variante")
    return atributo_repository.eliminar(variante_id, tipo_atributo_id)
