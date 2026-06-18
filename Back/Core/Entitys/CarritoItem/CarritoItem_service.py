import Back.Core.Entitys.CarritoItem.CarritoItem_repo as item_repo
import Back.Core.Entitys.Carrito.Carrito_repo as carrito_repo
from Back.Core.Entitys.Producto.Variante.Variante import Variante
def agregar_item(usuario_id: str, variante_id: str, cantidad: int = 1):
    carrito = carrito_repo.obtener_activo_por_usuario(usuario_id)
    if not carrito:
        carrito = carrito_repo.registrar(usuario_id)

    variante = Variante.get_or_none(Variante.id == variante_id)
    if not variante:
        raise ValueError("Variante no encontrada")
    if not variante.activa:
        raise ValueError("Variante no disponible")
    if variante.stock < cantidad:
        raise ValueError(f"Stock insuficiente: {variante.stock}")

    existente = item_repo.obtener_por_carrito_y_variante(carrito.id, variante_id)
    if existente:
        item_repo.actualizar_cantidad(existente.id, existente.cantidad + cantidad)
        return item_repo.obtener_por_id(existente.id)

    return item_repo.agregar(
        carrito_id=str(carrito.id),
        variante_id=variante_id,
        cantidad=cantidad,
        precio_unitario=float(variante.precio_venta),
    )
def actualizar_cantidad(item_id: str, usuario_id: str, cantidad: int):
    item = item_repo.obtener_por_id(item_id)
    if not item:
        raise ValueError("Item no encontrado")
    if str(item.carrito.usuario.id) != usuario_id:
        raise PermissionError("No es tu carrito")
    if cantidad <= 0:
        item_repo.eliminar(item_id)
        return True
    variante = item.variante
    if variante.stock < cantidad:
        raise ValueError(f"Stock insuficiente: {variante.stock}")
    item_repo.actualizar_cantidad(item_id, cantidad)
    return item_repo.obtener_por_id(item_id)
def eliminar_item(item_id: str, usuario_id: str):
    item = item_repo.obtener_por_id(item_id)
    if not item:
        raise ValueError("Item no encontrado")
    if str(item.carrito.usuario.id) != usuario_id:
        raise PermissionError("No es tu carrito")
    return item_repo.eliminar(item_id)
def listar_items(usuario_id: str):
    carrito = carrito_repo.obtener_activo_por_usuario(usuario_id)
    if not carrito:
        return []
    return item_repo.listar_por_carrito(carrito.id)
