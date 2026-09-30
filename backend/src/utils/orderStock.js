import inventoryModel from "../models/inventory/inventory.js";
import { reserveStock, releaseStock } from "./productLookup.js";

// Un pedido cuenta como cancelado sin importar mayúsculas ("Cancelado", "cancelado").
export const isCancelledStatus = (status) => /^cancelad/i.test(String(status || ""));

export const isPendingStatus = (status) => /^pendiente$/i.test(String(status || ""));

// Devuelve al inventario las unidades de un pedido cancelado. Los productos
// sin registro de inventario no manejan stock y se omiten.
export const restoreOrderStock = async (items = []) => {
  for (const item of items) {
    const quantity = Number(item.quantity) || 0;
    if (!item.productId || quantity <= 0) continue;
    await inventoryModel.updateOne(
      { productId: item.productId },
      { $inc: { stock: quantity } },
    );
  }
};

// Vuelve a descontar el stock de un pedido que se reactiva. Si algún producto
// ya no alcanza, revierte lo descontado y devuelve false.
export const reserveOrderStock = async (items = []) => {
  const movements = [];
  for (const item of items) {
    const quantity = Number(item.quantity) || 0;
    if (!item.productId || quantity <= 0) continue;
    const hasInventory = await inventoryModel.exists({ productId: item.productId });
    if (!hasInventory) continue;
    const applied = await reserveStock(item.productId, quantity);
    if (!applied) {
      await releaseStock(movements);
      return false;
    }
    movements.push(...applied);
  }
  return true;
};
