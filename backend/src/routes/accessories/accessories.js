import express from "express";
import productController from "../controllers/productController.js";
import upload from "../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
  .get(productController.getAllProducts)
  .post(
    upload.array("images", 10),
    productController.insertProduct
  );

router.route("/:id")
  .put(
    upload.array("images", 10),
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

export default router;