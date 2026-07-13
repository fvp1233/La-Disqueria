import express from "express";
import ordersController from "../../controllers/orders/ordersController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
.get(validateAuthCookie(["admin"]), ordersController.getOrders)
.post(ordersController.insertOrder);

router.route("/manual")
.post(validateAuthCookie(["admin"]), ordersController.insertManualOrder);

router.route("/bestsellers")
.get(ordersController.getBestSellers);

router.route("/:id")
.get(validateAuthCookie(["admin"]), ordersController.getOrderById)
.put(validateAuthCookie(["admin"]), ordersController.updateOrder)
.delete(validateAuthCookie(["admin"]), ordersController.deleteOrder);

export default router;