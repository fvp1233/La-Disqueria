import cartModel from "../../models/cart/cart.js";
import orderModel from "../../models/orders/orders.js";
import { findProduct, getStock, reserveStock, releaseStock } from "../../utils/productLookup.js";
import { isPendingStatus, restoreOrderStock } from "../../utils/orderStock.js";

const cartController = {};

// Límite de unidades de un mismo producto por compra.
const MAX_QUANTITY = 99;

const FALLBACK_IMAGE = "https://placehold.co/600x600/ece5db/9c9587?text=La+Disquer%C3%ADa";

// El carrito guarda el tipo en minúsculas (vinyl, cd, turntable, accessory),
// pero el schema de orders espera el nombre del modelo real referenciado.
const productModelByType = {
  vinyl: "Vinyl",
  cd: "CD",
  turntable: "Turntable",
  accessory: "Accessory",
};

// INSERT - registra una compra simulada: deja constancia en cart y además
// crea el pedido formal en orders para que el panel admin le dé seguimiento.
cartController.insertCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { items: rawItems, shipping_address, payment_method } = req.body;
    const notes = typeof req.body.notes === "string" ? req.body.notes.trim() : "";

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const street = shipping_address?.street?.trim?.() || "";
    const city = shipping_address?.city?.trim?.() || "";

    if (!street || !city) {
      return res.status(400).json({ message: "Ingresa la dirección y la ciudad de envío" });
    }

    if (street.length < 5 || street.length > 150 || city.length < 3 || city.length > 60) {
      return res.status(400).json({ message: "La dirección de envío no es válida" });
    }

    if (typeof payment_method !== "string" || !payment_method.trim()) {
      return res.status(400).json({ message: "Selecciona un método de pago" });
    }

    if (notes.length > 250) {
      return res.status(400).json({ message: "Las notas no pueden superar 250 caracteres" });
    }

    // Une las líneas repetidas del mismo producto y valida las cantidades.
    const quantities = new Map();
    for (const item of rawItems) {
      const quantity = Number(item?.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return res.status(400).json({
          message: `La cantidad de cada producto debe ser un número entero entre 1 y ${MAX_QUANTITY}`,
        });
      }
      const key = String(item?.productId || "");
      const current = quantities.get(key);
      quantities.set(key, {
        type: item?.type,
        quantity: (current?.quantity || 0) + quantity,
      });
    }

    // Toma precio, título e imagen de la base de datos, nunca del cliente,
    // y comprueba disponibilidad y stock de cada producto.
    const items = [];
    for (const [productId, line] of quantities) {
      const product = await findProduct(productId, line.type);

      if (!product) {
        return res.status(404).json({ message: "Uno de los productos ya no existe" });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ message: `"${product.title}" no está disponible` });
      }

      if (product.price < 0) {
        return res.status(400).json({ message: `"${product.title}" tiene un precio no válido` });
      }

      const stock = await getStock(product.id);
      if (stock !== null && line.quantity > stock) {
        return res.status(400).json({
          message:
            stock === 0
              ? `"${product.title}" está agotado`
              : `Solo quedan ${stock} unidades de "${product.title}"`,
          productId: product.id,
          stock,
        });
      }

      items.push({
        productId: product.id,
        type: product.type,
        title: product.title,
        price: product.price,
        image: product.image || FALLBACK_IMAGE,
        quantity: line.quantity,
        tracksStock: stock !== null,
      });
    }

    // Descuenta el inventario. Si otro cliente se llevó las últimas unidades
    // mientras tanto, se revierte lo descontado y se rechaza la compra.
    const movements = [];
    for (const item of items) {
      if (!item.tracksStock) continue;
      const applied = await reserveStock(item.productId, item.quantity);
      if (!applied) {
        await releaseStock(movements);
        return res.status(409).json({
          message: `Ya no hay stock suficiente de "${item.title}"`,
          productId: item.productId,
        });
      }
      movements.push(...applied);
    }
    items.forEach((item) => delete item.tracksStock);

    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    subtotal = Math.round(subtotal * 100) / 100;

    const shipping = 0;
    const total = subtotal + shipping;
    const order_number = `ORD-${Date.now()}`;

    const address = { street, city };

    const newCart = new cartModel({
      customer_id: customerId,
      items,
      status: "comprado",
      subtotal,
      shipping,
      total,
      shipping_address: address,
      payment_method: payment_method.trim(),
      notes,
      order_number,
      purchased_at: Date.now(),
    });

    const newOrder = new orderModel({
      customerId,
      status: "pendiente",
      items: items.map((item) => ({
        ...item,
        productModel: productModelByType[item.type],
      })),
      subtotal,
      shipping,
      total,
      shipping_address: address,
      payment_method: payment_method.trim(),
      order_number,
      notes,
    });

    try {
      await newCart.save();
      await newOrder.save();
    } catch (saveError) {
      // Si no se pudo registrar la compra, el inventario vuelve a su estado.
      await releaseStock(movements);
      await cartModel.deleteOne({ _id: newCart._id });
      throw saveError;
    }

    return res.status(201).json({
      message: "Compra registrada correctamente",
      cart: newCart,
      order: newOrder,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SELECT - historial de compras del cliente autenticado
cartController.getCartsByCustomer = async (req, res) => {
  try {
    const carts = await cartModel
      .find({ customer_id: req.user.id, status: { $in: ["comprado", "cancelado"] } })
      .sort({ createdAt: -1 })
      .lean();

    // El estado del envío lo administra el panel en orders; se agrega a cada compra.
    const orders = await orderModel
      .find({ order_number: { $in: carts.map((cart) => cart.order_number) } })
      .select("order_number status")
      .lean();
    const statusByNumber = new Map(orders.map((order) => [order.order_number, order.status]));

    const history = carts.map((cart) => ({
      ...cart,
      order_status:
        cart.status === "cancelado"
          ? "Cancelado"
          : statusByNumber.get(cart.order_number) || "Pendiente",
    }));

    return res.status(200).json(history);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE - el cliente cancela un pedido propio que sigue pendiente. Las
// unidades vuelven al inventario para que otros clientes puedan comprarlas.
cartController.cancelOwnOrder = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ _id: req.params.id, customer_id: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    if (cart.status === "cancelado") {
      return res.status(400).json({ message: "El pedido ya estaba cancelado" });
    }

    const order = await orderModel.findOne({ order_number: cart.order_number });

    if (order && !isPendingStatus(order.status)) {
      return res.status(400).json({
        message: `No se puede cancelar un pedido en estado "${order.status}"`,
      });
    }

    if (order) {
      order.status = "Cancelado";
      await order.save();
    }

    cart.status = "cancelado";
    await cart.save();
    await restoreOrderStock(cart.items);

    return res.status(200).json({ message: "Pedido cancelado" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SELECT BY ID - detalle de una compra puntual (para la pantalla de confirmación)
cartController.getCartById = async (req, res) => {
  try {
    const cart = await cartModel.findOne({
      _id: req.params.id,
      customer_id: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default cartController;
