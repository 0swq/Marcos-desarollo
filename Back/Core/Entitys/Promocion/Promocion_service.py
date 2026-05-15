from typing import List, Optional
import Back.Core.Entitys.Promocion.Promocion_repo as repo
from Back.Core.Entitys.Promocion.Promocion import PromocionSchema, PromocionCreate, PromocionUpdate



def listar() -> List[PromocionSchema]:
    return repo.listar()


def obtener(promocion_id: str) -> Optional[PromocionSchema]:
    return repo.obtener(promocion_id)


def crear(datos: PromocionCreate) -> PromocionSchema:
    return repo.crear(datos)


def actualizar(promocion_id: str, datos: PromocionUpdate) -> Optional[PromocionSchema]:
    return repo.actualizar(promocion_id, datos)


def cambiar_estado(promocion_id: str) -> Optional[PromocionSchema]:
    return repo.cambiar_estado(promocion_id)


def eliminar(promocion_id: str) -> bool:
    return repo.eliminar(promocion_id)
