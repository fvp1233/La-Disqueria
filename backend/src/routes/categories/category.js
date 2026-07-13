import express from "express";
import categoryController from "../../controllers/categories/categoryController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(categoryController.getCategories)
  .post(validateAuthCookie(["admin"]), categoryController.insertCategory);

router.route("/:id")
  .put(validateAuthCookie(["admin"]), categoryController.updateCategory)
  .delete(validateAuthCookie(["admin"]), categoryController.deleteCategory);

router.route("/slug/:slug").get(categoryController.getCategoryBySlug);

export default router;
