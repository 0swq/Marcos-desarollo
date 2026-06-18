from Back.Core.Entitys.VarianteAtributo import VarianteAtributo
from Back.Core.Entitys.TipoAtributo import TipoAtributo


def agregar(variante_id, tipo_atributo_id, valor) -> VarianteAtributo:
    return VarianteAtributo.create(
        variante=variante_id,
        tipo_atributo=tipo_atributo_id,
        valor=valor
    )


def obtener(variante_id, tipo_atributo_id) -> VarianteAtributo | None:
    return VarianteAtributo.get_or_none(
        (VarianteAtributo.variante == variante_id) &
        (VarianteAtributo.tipo_atributo == tipo_atributo_id)
    )


def listar_por_variante(variante_id) -> list[VarianteAtributo]:
    return list(
        VarianteAtributo.select(VarianteAtributo, TipoAtributo)
        .join(TipoAtributo)
        .where(VarianteAtributo.variante == variante_id)
    )


def actualizar(variante_id, tipo_atributo_id, valor) -> bool:
    filas = (VarianteAtributo.update(valor=valor)
             .where(
                (VarianteAtributo.variante == variante_id) &
                (VarianteAtributo.tipo_atributo == tipo_atributo_id)
             )
             .execute())
    return filas > 0


def eliminar(variante_id, tipo_atributo_id) -> bool:
    filas = (VarianteAtributo.delete()
             .where(
                (VarianteAtributo.variante == variante_id) &
                (VarianteAtributo.tipo_atributo == tipo_atributo_id)
             )
             .execute())
    return filas > 0


def eliminar_por_variante(variante_id) -> bool:
    filas = (VarianteAtributo.delete()
             .where(VarianteAtributo.variante == variante_id)
             .execute())
    return filas > 0