# Proveedor_service.py

from Back.Core.Entitys.Proveedor import Proveedor
import Back.Core.Entitys.Proveedor.Proveedor_repo as proveedor_repository


def registrar(nombre, ruc=None, telefono=None,email=None, direccion=None, ciudad=None) -> Proveedor:
    if ruc:
        if proveedor_repository.obtener_por_ruc(ruc):
            raise ValueError(f"Ya existe un proveedor con RUC {ruc}")
    return proveedor_repository.crear(nombre, ruc, telefono, email, direccion, ciudad)


def obtener_por_id(proveedor_id) -> Proveedor:
    proveedor = proveedor_repository.obtener_por_id(proveedor_id)
    if not proveedor:
        raise ValueError(f"Proveedor {proveedor_id} no encontrado")
    return proveedor


def buscar(busqueda: str) -> Proveedor | None:
    return proveedor_repository.buscar(busqueda)


def listar_activos() -> list[Proveedor]:
    return proveedor_repository.listar_activos()

def listar() -> list[Proveedor]:
    return proveedor_repository.listar()

def actualizar(proveedor_id, **campos) -> Proveedor:
    proveedor = proveedor_repository.obtener_por_id(proveedor_id)
    if not proveedor:
        raise ValueError(f"Proveedor {proveedor_id} no encontrado")

    if not campos:
        raise ValueError("No se enviaron campos para actualizar")

    if "ruc" in campos:
        existente = proveedor_repository.obtener_por_ruc(campos["ruc"])
        if existente and str(existente.id) != str(proveedor_id):
            raise ValueError(f"El RUC {campos['ruc']} ya está registrado")

    proveedor_repository.actualizar(proveedor_id, **campos)
    return proveedor_repository.obtener_por_id(proveedor_id)


def desactivar(proveedor_id) -> bool:
    if not proveedor_repository.obtener_por_id(proveedor_id):
        raise ValueError(f"Proveedor {proveedor_id} no encontrado")
    return proveedor_repository.desactivar(proveedor_id)