import express from "express";
import productsController from "../../controllers/products/productsController.js";

const router = express.Router();

router.route("/").get(productsController.getProducts);

export default router;
