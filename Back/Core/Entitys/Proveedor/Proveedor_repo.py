from Back.Core.Entitys.Proveedor import Proveedor

def crear(nombre, ruc=None, telefono=None, email=None,direccion=None, ciudad=None) -> Proveedor:
    return Proveedor.create(nombre=nombre, ruc=ruc, telefono=telefono,email=email, direccion=direccion, ciudad=ciudad)
def buscar(busqueda) -> Proveedor:
    return Proveedor.select().where((Proveedor.nombre.contains(busqueda)) | (Proveedor.ruc.contains(busqueda))).first()

def obtener_por_id(proveedor_id) -> Proveedor | None:
    return Proveedor.get_or_none((Proveedor.id == proveedor_id) & (Proveedor.activo == True))

def obtener_por_ruc(ruc: str) -> Proveedor | None:
    return Proveedor.get_or_none((Proveedor.ruc == ruc) & (Proveedor.activo == True)
    )

def listar_activos() -> list[Proveedor]:
    return list(Proveedor.select().where(Proveedor.activo == True))
def listar() -> list[Proveedor]:
    return list(Proveedor.select())
def actualizar(proveedor_id, **campos) -> bool:
    if not campos:
        return False
    filas = (Proveedor.update(campos).where(Proveedor.id == proveedor_id).execute())
    return filas > 0

def desactivar(proveedor_id) -> bool:
    filas = (Proveedor.update(activo=False)
             .where(Proveedor.id == proveedor_id)
             .execute())
    return filas > 0