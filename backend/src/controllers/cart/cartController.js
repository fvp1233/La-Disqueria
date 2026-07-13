import cartModel from "../../models/cart/cart.js";
import orderModel from "../../models/orders/orders.js";

const cartController = {};

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
    const { items, shipping_address, payment_method, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    let subtotal = 0;
    items.forEach((item) => {
      subtotal += (item.price || 0) * (item.quantity || 1);
    });

    const shipping = 0;
    const total = subtotal + shipping;
    const order_number = `ORD-${Date.now()}`;

    const newCart = new cartModel({
      customer_id: customerId,
      items,
      status: "comprado",
      subtotal,
      shipping,
      total,
      shipping_address,
      payment_method,
      notes,
      order_number,
      purchased_at: Date.now(),
    });

    await newCart.save();

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
      shipping_address,
      payment_method,
      order_number,
      notes,
    });

    await newOrder.save();

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
      .find({ customer_id: req.user.id, status: "comprado" })
      .sort({ createdAt: -1 });

    return res.status(200).json(carts);
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
