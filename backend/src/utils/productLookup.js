import mongoose from "mongoose";
import vinylModel from "../models/vinyls/vinyl.js";
import cdsModel from "../models/cds/cds.js";
import turntablesModel from "../models/turntables/turntables.js";
import accessoriesModel from "../models/accessories/accessories.js";
import inventoryModel from "../models/inventory/inventory.js";

// Modelo y forma de leer el título/portada de cada tipo de producto.
const PRODUCT_SOURCES = {
  vinyl: {
    model: vinylModel,
    title: (doc) => doc.tittle || doc.title || "Sin título",
    image: (doc) => doc.images?.find((img) => img?.isCover)?.image || doc.images?.[0]?.image,
  },
  cd: {
    model: cdsModel,
    title: (doc) => doc.title || "Sin título",
    image: (doc) => doc.images?.find((img) => img?.isCover)?.image || doc.images?.[0]?.image,
  },
  turntable: {
    model: turntablesModel,
    title: (doc) => `${doc.brand || ""} ${doc.model || ""}`.trim() || "Sin título",
    image: (doc) => doc.images?.find((img) => img?.isCover)?.image || doc.images?.[0]?.image,
  },
  accessory: {
    model: accessoriesModel,
    title: (doc) => doc.name || "Sin título",
    image: (doc) => {
      const first = doc.images?.[0];
      return typeof first === "string" ? first : first?.image;
    },
  },
};

export const PRODUCT_TYPES = Object.keys(PRODUCT_SOURCES);

// Busca un producto por id. Si se conoce el tipo solo consulta esa colección,
// si no, prueba en las cuatro. Devuelve datos ya normalizados o null.
export const findProduct = async (id, type) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const types = type && PRODUCT_SOURCES[type] ? [type] : PRODUCT_TYPES;

  for (const currentType of types) {
    const source = PRODUCT_SOURCES[currentType];
    const doc = await source.model.findById(id).lean();
    if (doc) {
      return {
        id: doc._id,
        type: currentType,
        title: source.title(doc),
        image: source.image(doc) || "",
        price: Number(doc.price) || 0,
        isAvailable: doc.isAvailable ?? true,
      };
    }
  }

  return null;
};

// Stock disponible de un producto según sus registros de inventario.
// Devuelve null cuando el producto no tiene inventario registrado.
export const getStock = async (productId) => {
  const records = await inventoryModel.find({ productId }).lean();
  if (records.length === 0) return null;
  return records.reduce((total, record) => total + Math.max(0, Number(record.stock) || 0), 0);
};

// Descuenta del inventario la cantidad comprada. Recorre los registros del
// producto y usa actualizaciones condicionales para no dejar stock negativo
// aunque lleguen dos compras al mismo tiempo. Devuelve los movimientos hechos
// para poder revertirlos, o null si no alcanzó el stock.
export const reserveStock = async (productId, quantity) => {
  const records = await inventoryModel
    .find({ productId, stock: { $gt: 0 } })
    .sort({ stock: -1 })
    .lean();

  const applied = [];
  let pending = quantity;

  for (const record of records) {
    if (pending === 0) break;
    const take = Math.min(pending, record.stock);
    const result = await inventoryModel.updateOne(
      { _id: record._id, stock: { $gte: take } },
      { $inc: { stock: -take } },
    );
    if (result.modifiedCount === 1) {
      applied.push({ recordId: record._id, quantity: take });
      pending -= take;
    }
  }

  if (pending > 0) {
    await releaseStock(applied);
    return null;
  }

  return applied;
};

// Devuelve al inventario las cantidades descontadas por reserveStock.
export const releaseStock = async (movements = []) => {
  await Promise.all(
    movements.map((movement) =>
      inventoryModel.updateOne({ _id: movement.recordId }, { $inc: { stock: movement.quantity } }),
    ),
  );
};
