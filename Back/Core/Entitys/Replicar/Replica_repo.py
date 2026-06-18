
import uuid

from Back.Core.Entitys.Producto.ProductoBase import ProductoBase
from Back.Core.Entitys.Replicar.Replica import Replica
def crear(usuario_id: str, producto_base_id: str, imagen_original: str) -> Replica:
    return Replica.create(
        id=uuid.uuid4(),
        usuario=usuario_id,
        producto=producto_base_id,
        imagen_original=imagen_original,
        estado='pendiente',
    )
def obtener_por_id(replica_id: str, usuario_id: str) -> Replica | None:
    return (
        Replica
        .select()
        .where(
            (Replica.id == replica_id) &
            (Replica.usuario == usuario_id)
        )
        .first()
    )
def actualizar(replica_id: str, **campos) -> bool:
    filas = (
        Replica
        .update(**campos)
        .where(Replica.id == replica_id)
        .execute()
    )
    return filas > 0
def listar(usuario_id: str, pagina: int = 1, por_pagina: int = 12) -> tuple[list[Replica], int]:
    total = (
        Replica
        .select()
        .where(Replica.usuario == usuario_id)
        .count()
    )
    registros = (
        Replica
        .select(Replica, ProductoBase)
        .join(ProductoBase)
        .where(Replica.usuario == usuario_id)
        .order_by(Replica.created_at.desc())
        .paginate(pagina, por_pagina)
    )
    return list(registros), total