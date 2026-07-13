import express from "express";
import cartController from "../../controllers/cart/cartController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["customer"], ["admin"]), cartController.getCartsByCustomer)
  .post(validateAuthCookie(["customer"]), cartController.insertCart);

router.route("/:id").get(validateAuthCookie(["customer"]), cartController.getCartById);

export default router;
