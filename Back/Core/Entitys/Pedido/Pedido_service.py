from typing import List, Optional
import Back.Core.Entitys.Pedido.Pedido_repo as repo
from Back.Core.Entitys.Pedido.Pedido import PedidoResumen, PedidoDetalle


def listar_mis_pedidos(usuario_id: str) -> List[PedidoResumen]:
    return repo.listar_por_usuario(usuario_id)


def obtener_detalle(pedido_id: str, usuario_id: str) -> Optional[PedidoDetalle]:
    return repo.obtener_detalle(pedido_id, usuario_id)


def listar_todos() -> List[PedidoResumen]:
    """Solo para admin."""
    return repo.listar_todos()