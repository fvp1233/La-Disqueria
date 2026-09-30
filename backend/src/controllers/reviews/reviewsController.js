import mongoose from "mongoose";
import reviewModel from "../../models/reviews/review.js";
import customerModel from "../../models/customers/customer.js";
import cartModel from "../../models/cart/cart.js";
import { findProduct } from "../../utils/productLookup.js";

const reviewsController = {};

const COMMENT_MIN = 3;
const COMMENT_MAX = 500;

// Solo puede valorar quien compró el producto en un pedido que no se canceló.
const hasPurchased = (customerId, productId) =>
  cartModel.exists({
    customer_id: customerId,
    status: "comprado",
    "items.productId": productId,
  });

// SELECT - indica si el cliente autenticado puede valorar el producto.
reviewsController.getEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const purchased = await hasPurchased(req.user.id, productId);
    return res.status(200).json({ canReview: Boolean(purchased) });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SELECT - valoraciones de un producto con su promedio. Público.
reviewsController.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const reviews = await reviewModel
      .find({ productId })
      .sort({ updatedAt: -1 })
      .lean();

    const count = reviews.length;
    const average = count
      ? Math.round((reviews.reduce((total, review) => total + review.rating, 0) / count) * 10) / 10
      : 0;

    return res.status(200).json({ reviews, average, count });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// INSERT/UPDATE - el cliente autenticado valora un producto. Si ya lo había
// valorado, se reemplaza su valoración anterior.
reviewsController.upsertReview = async (req, res) => {
  try {
    const { productId } = req.body;
    const rating = Number(req.body.rating);
    const comment = typeof req.body.comment === "string" ? req.body.comment.trim() : "";

    if (!productId || !req.body.rating || !comment) {
      return res.status(400).json({ message: "Fields required" });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "La calificación debe ser un número entero del 1 al 5" });
    }

    if (comment.length < COMMENT_MIN || comment.length > COMMENT_MAX) {
      return res.status(400).json({
        message: `El comentario debe tener entre ${COMMENT_MIN} y ${COMMENT_MAX} caracteres`,
      });
    }

    const product = await findProduct(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const purchased = await hasPurchased(req.user.id, product.id);
    if (!purchased) {
      return res.status(403).json({
        message: "Solo puedes valorar productos que hayas comprado",
      });
    }

    const customer = await customerModel.findById(req.user.id).select("name last_name").lean();
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const review = await reviewModel.findOneAndUpdate(
      { productId: product.id, customerId: req.user.id },
      {
        productType: product.type,
        customerName: `${customer.name || ""} ${customer.last_name || ""}`.trim(),
        rating,
        comment,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(201).json({ message: "Valoración guardada", review });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE - el cliente elimina su propia valoración.
reviewsController.deleteOwnReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const deleted = await reviewModel.findOneAndDelete({ _id: id, customerId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Valoración no encontrada" });
    }

    return res.status(200).json({ message: "Valoración eliminada" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default reviewsController;
