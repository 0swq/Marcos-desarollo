from Back.Core.Entitys.Direccion.Direccion import Direccion


def registrar(usuario_id, calle, ciudad, alias=None, referencia=None, es_principal=False) -> Direccion:
    return Direccion.create(
        usuario=usuario_id,
        alias=alias,
        calle=calle,
        ciudad=ciudad,
        referencia=referencia,
        es_principal=es_principal
    )

def obtener_por_id(direccion_id) -> Direccion | None:
    return Direccion.get_or_none(Direccion.id == direccion_id)


def listar_por_usuario(usuario_id) -> list[Direccion]:
    return list(Direccion.select().where(Direccion.usuario == usuario_id))


def obtener_principal(usuario_id) -> Direccion | None:
    return Direccion.get_or_none(
        (Direccion.usuario == usuario_id) & (Direccion.es_principal == True)
    )


def cambiar_principal(direccion_id,usuario_id) -> bool:
    es_principal=(not obtener_por_id(usuario_id).es_principal)
    filas = Direccion.update(es_principal=es_principal).where(Direccion.usuario == usuario_id and Direccion.id==direccion_id).execute()
    return filas>0


def actualizar(direccion_id, **campos) -> bool:
    if not campos:
        return False
    filas = (Direccion.update(campos)
             .where(Direccion.id == direccion_id)
             .execute())
    return filas > 0


def eliminar(direccion_id) -> bool:
    filas = Direccion.delete().where(Direccion.id == direccion_id).execute()
    return filas > 0