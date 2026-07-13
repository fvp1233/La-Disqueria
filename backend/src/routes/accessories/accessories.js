import express from "express";
import accessoriesController from "../../controllers/accessories/accessoriesController.js";
import upload from "../../utils/CloudinaryConfig.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(accessoriesController.getAllaccessories)
  .post(
    validateAuthCookie(["admin"]),
    upload.array("images", 10),
    accessoriesController.insertaccessorie
  );

router.route("/:id")
  .get(accessoriesController.getAccessorieById)
  .put(
    validateAuthCookie(["admin"]),
    upload.array("images", 10),
    accessoriesController.updateaccessorie
  )
  .delete(validateAuthCookie(["admin"]), accessoriesController.deleteaccessorie);

export default router;