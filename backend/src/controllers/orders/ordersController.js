import orderModel from "../../models/orders/orders.js";
import cartModel from "../../models/cart/cart.js";

const ordersController = {};

// SELECT
ordersController.getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("customerId", "name email");

    return res.status(200).json(orders);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// SELECT BY ID
ordersController.getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("customerId", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// INSERT
ordersController.insertOrder = async (req, res) => {
  try {
    const {
      customerId,
      shipping_address,
      payment_method,
      notes,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer is required",
      });
    }

    // Buscar carrito del cliente
    const cart = await cartModel.findOne({
      customer_id: customerId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Calcular subtotal
    let subtotal = 0;

    cart.items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // Costo de envío
    const shipping = 8000;

    // Total
    const total = subtotal + shipping;

    // Generar número de orden
    const order_number = `ORD-${Date.now()}`;

    const newOrder = new orderModel({
      customerId,
      status: "pendiente",
      items: cart.items,
      subtotal,
      shipping,
      total,
      shipping_address,
      payment_method,
      order_number,
      notes,
    });

    await newOrder.save();

    // Vaciar carrito después de crear la orden
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// INSERT MANUAL ORDER (ADMIN)
ordersController.insertManualOrder = async (req, res) => {
  try {
    const {
      customerId,
      items,
      shipping_address,
      payment_method,
      notes,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Items are required",
      });
    }

    // Calcular subtotal
    let subtotal = 0;

    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // En tienda normalmente no hay envío
    const shipping = 0;

    const total = subtotal + shipping;

    const order_number = `ORD-${Date.now()}`;

    const newOrder = new orderModel({
      customerId,
      status: "pendiente",
      items,
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
      message: "Manual order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("error " + error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE
ordersController.updateOrder = async (req, res) => {
  try {
    const {
      customerId,
      status,
      shipping_address,
      payment_method,
      notes,
    } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        status,
        shipping_address,
        payment_method,
        notes,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE
ordersController.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default ordersController;