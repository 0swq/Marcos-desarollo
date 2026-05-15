from typing import List, Optional
from Back.Core.Entitys.Promocion.Promocion import (
    Promocion, PromocionSchema, PromocionCreate, PromocionUpdate
)


def _a_schema(p: Promocion) -> PromocionSchema:
    return PromocionSchema(
        id=str(p.id),
        nombre=p.nombre,
        tipo_descuento=p.tipo_descuento,
        valor=float(p.valor),
        aplica_a=p.aplica_a,
        categoria_id=str(p.categoria_id) if p.categoria_id else None,
        producto_base_id=str(p.producto_base_id) if p.producto_base_id else None,
        variante_id=str(p.variante_id) if p.variante_id else None,
        activa=p.activa,
        valido_desde=p.valido_desde,
        valido_hasta=p.valido_hasta,
    )


def listar() -> List[PromocionSchema]:
    promociones = list(Promocion.select().order_by(Promocion.valido_hasta.desc()))
    return [_a_schema(p) for p in promociones]


def obtener(promocion_id: str) -> Optional[PromocionSchema]:
    p = Promocion.get_or_none(Promocion.id == promocion_id)
    return _a_schema(p) if p else None


def crear(datos: PromocionCreate) -> PromocionSchema:
    p = Promocion.create(
        nombre=datos.nombre,
        tipo_descuento=datos.tipo_descuento,
        valor=datos.valor,
        aplica_a=datos.aplica_a,
        categoria_id=datos.categoria_id or None,
        producto_base_id=datos.producto_base_id or None,
        variante_id=datos.variante_id or None,
        activa=datos.activa,
        valido_desde=datos.valido_desde,
        valido_hasta=datos.valido_hasta,
    )
    return _a_schema(p)


def actualizar(promocion_id: str, datos: PromocionUpdate) -> Optional[PromocionSchema]:
    p = Promocion.get_or_none(Promocion.id == promocion_id)
    if not p:
        return None
    campos = {k: v for k, v in datos.model_dump(exclude_unset=True).items()}
    if campos:
        Promocion.update(**campos).where(Promocion.id == promocion_id).execute()
    return _a_schema(Promocion.get_by_id(promocion_id))


def cambiar_estado(promocion_id: str) -> Optional[PromocionSchema]:
    p = Promocion.get_or_none(Promocion.id == promocion_id)
    if not p:
        return None
    Promocion.update(activa=not p.activa).where(Promocion.id == promocion_id).execute()
    return _a_schema(Promocion.get_by_id(promocion_id))


def eliminar(promocion_id: str) -> bool:
    filas = Promocion.delete().where(Promocion.id == promocion_id).execute()
    return filas > 0