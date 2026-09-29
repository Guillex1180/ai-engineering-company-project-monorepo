"""
Módulo de inventario de la API de TrackFlow (dataset de DEMOSTRACIÓN).

AVISO DE ALCANCE: el CONTEXT oficial de TrackFlow no define un contrato de
inventario. Este módulo implementa una API de inventario de demostración,
coherente con el dominio real (categorías de producto y almacenes Los Ángeles /
Zaragoza del CONTEXT). El estado se guarda EN MEMORIA del proceso: se reinicia al
reiniciar el servidor. No hay base de datos.

Contrato:
  - Product:        id, sku, name, category, warehouse, current_stock
  - InventoryOrder: id, product_id, product_name, type, quantity, user_uuid, created_at
  - inbound  {product_id, quantity}  -> suma stock
  - outbound {product_id, quantity}  -> resta stock; 400 si quantity > current_stock
"""
from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from .auth import require_user

router = APIRouter(prefix="/inventory", tags=["Inventory"])

# Categorías y almacenes derivados del CONTEXT de TrackFlow.
_CATEGORIES = ("moda", "electronica", "cosmetica", "alimentacion")
_WAREHOUSES = ("los_angeles", "zaragoza")


class Product(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    warehouse: str
    current_stock: int


class InventoryOrder(BaseModel):
    id: str
    product_id: str
    product_name: str
    type: str  # "inbound" | "outbound"
    quantity: int
    user_uuid: str
    created_at: str


class OrderInput(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)


class _Store:
    """Almacén en memoria protegido por lock (demo)."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.products: dict[str, Product] = {}
        self.orders: list[InventoryOrder] = []
        self._seed()

    def _seed(self) -> None:
        seed = [
            ("TF-MOD-001", "Camiseta técnica", "moda", "zaragoza", 42),
            ("TF-MOD-002", "Chaqueta impermeable", "moda", "los_angeles", 7),
            ("TF-ELE-001", "Auriculares inalámbricos", "electronica", "los_angeles", 15),
            ("TF-ELE-002", "Smartwatch deportivo", "electronica", "zaragoza", 0),
            ("TF-COS-001", "Sérum facial", "cosmetica", "zaragoza", 120),
            ("TF-COS-002", "Crema hidratante", "cosmetica", "los_angeles", 9),
            ("TF-ALI-001", "Barritas energéticas", "alimentacion", "zaragoza", 3),
        ]
        for sku, name, category, warehouse, stock in seed:
            pid = str(uuid.uuid4())
            self.products[pid] = Product(
                id=pid, sku=sku, name=name, category=category,
                warehouse=warehouse, current_stock=stock,
            )

    def list_products(self) -> list[Product]:
        with self._lock:
            return list(self.products.values())

    def list_orders(self) -> list[InventoryOrder]:
        with self._lock:
            # Más recientes primero.
            return list(reversed(self.orders))

    def _record_order(self, product: Product, type_: str, quantity: int, user_uuid: str) -> InventoryOrder:
        order = InventoryOrder(
            id=str(uuid.uuid4()),
            product_id=product.id,
            product_name=product.name,
            type=type_,
            quantity=quantity,
            user_uuid=user_uuid,
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        self.orders.append(order)
        return order

    def inbound(self, product_id: str, quantity: int, user_uuid: str) -> tuple[Product, InventoryOrder]:
        with self._lock:
            product = self.products.get(product_id)
            if product is None:
                raise HTTPException(status_code=404, detail="El producto no existe.")
            product.current_stock += quantity
            order = self._record_order(product, "inbound", quantity, user_uuid)
            return product, order

    def outbound(self, product_id: str, quantity: int, user_uuid: str) -> tuple[Product, InventoryOrder]:
        with self._lock:
            product = self.products.get(product_id)
            if product is None:
                raise HTTPException(status_code=404, detail="El producto no existe.")
            if quantity > product.current_stock:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Stock insuficiente: se solicitaron {quantity} unidades "
                        f"pero solo hay {product.current_stock} disponibles."
                    ),
                )
            product.current_stock -= quantity
            order = self._record_order(product, "outbound", quantity, user_uuid)
            return product, order


store = _Store()


@router.get("/products", response_model=list[Product])
def get_products(user: str = Depends(require_user)) -> list[Product]:
    return store.list_products()


@router.get("/orders", response_model=list[InventoryOrder])
def get_orders(user: str = Depends(require_user)) -> list[InventoryOrder]:
    return store.list_orders()


@router.post("/orders/inbound", response_model=InventoryOrder, status_code=201)
def create_inbound(payload: OrderInput, user: str = Depends(require_user)) -> InventoryOrder:
    _, order = store.inbound(payload.product_id, payload.quantity, user)
    return order


@router.post("/orders/outbound", response_model=InventoryOrder, status_code=201)
def create_outbound(payload: OrderInput, user: str = Depends(require_user)) -> InventoryOrder:
    _, order = store.outbound(payload.product_id, payload.quantity, user)
    return order
