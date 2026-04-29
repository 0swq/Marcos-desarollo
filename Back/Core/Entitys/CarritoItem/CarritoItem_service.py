from Back.Core.Entitys.CarritoItem import CarritoItem
import Back.Core.Entitys.CarritoItem.CarritoItem_repo as item_repository
import Back.Core.Entitys.Carrito.Carrito_repo as carrito_repository
import Back.Core.Entitys.Variante.Variante_repo as variante_repository

def _validar_carrito_activo(carrito_id, usuario_id):
    carrito = carrito_repository.obtener_por_id(carrito_id)
    if not carrito:
        raise ValueError(f"Carrito {carrito_id} no encontrado")
    if str(carrito.usuario.id) != str(usuario_id):
        raise PermissionError("Este carrito no es tuyo")
    if carrito.estado != 'activo':
        raise ValueError(f"El carrito está {carrito.estado}")
    return carrito


def agregar_item(carrito_id, usuario_id, variante_id, cantidad) -> CarritoItem:
    _validar_carrito_activo(carrito_id, usuario_id)
    variante = variante_repository.obtener_por_id(variante_id)
    if not variante:
        raise ValueError(f"Variante {variante_id} no encontrada")
    if not variante.activa:
        raise ValueError("La variante no está disponible")
    if variante.stock < cantidad:
        raise ValueError(f"Stock insuficiente, disponible: {variante.stock}")

    existente = item_repository.obtener_por_carrito_y_variante(carrito_id, variante_id)
    if existente:
        nueva_cantidad = existente.cantidad + cantidad
        if variante.stock < nueva_cantidad:
            raise ValueError(f"Stock insuficiente, disponible: {variante.stock}")
        item_repository.actualizar_cantidad(existente.id, nueva_cantidad)
        return item_repository.obtener_por_id(existente.id)

    return item_repository.agregar(carrito_id, variante_id, cantidad, variante.precio_venta)


def listar_items(carrito_id, usuario_id) -> list[CarritoItem]:
    _validar_carrito_activo(carrito_id, usuario_id)
    return item_repository.listar_por_carrito(carrito_id)


def actualizar_cantidad(carrito_id, usuario_id, item_id, cantidad) -> CarritoItem:
    _validar_carrito_activo(carrito_id, usuario_id)

    if cantidad <= 0:
        raise ValueError("La cantidad debe ser mayor a 0")

    item = item_repository.obtener_por_id(item_id)
    if not item:
        raise ValueError(f"Item {item_id} no encontrado")
    if str(item.carrito.id) != str(carrito_id):
        raise PermissionError("Este item no pertenece al carrito")

    variante = variante_repository.obtener_por_id(item.variante.id)
    if variante.stock < cantidad:
        raise ValueError(f"Stock insuficiente, disponible: {variante.stock}")

    item_repository.actualizar_cantidad(item_id, cantidad)
    return item_repository.obtener_por_id(item_id)


def eliminar_item(carrito_id, usuario_id, item_id) -> bool:
    _validar_carrito_activo(carrito_id, usuario_id)

    item = item_repository.obtener_por_id(item_id)
    if not item:
        raise ValueError(f"Item {item_id} no encontrado")
    if str(item.carrito.id) != str(carrito_id):
        raise PermissionError("Este item no pertenece al carrito")

    return item_repository.eliminar(item_id)


def vaciar_carrito(carrito_id, usuario_id) -> bool:
    _validar_carrito_activo(carrito_id, usuario_id)
    return item_repository.vaciar_carrito(carrito_id)


def calcular_total(carrito_id, usuario_id) -> dict:
    _validar_carrito_activo(carrito_id, usuario_id)
    items = item_repository.listar_por_carrito(carrito_id)
    total = sum(item.precio_unitario * item.cantidad for item in items)
    return {
        "items": len(items),
        "total": float(total)
    }