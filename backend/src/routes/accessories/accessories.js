import express from "express";
import accessoriesController from "../../controllers/accessories/accessoriesController.js";
import upload from "../../utils/CloudinaryConfig.js";

const router = express.Router();

router.route("/")
  .get(accessoriesController.getAllaccessories)
  .post(
    upload.array("images", 10),
    accessoriesController.insertaccessorie
  );

router.route("/:id")
  .put(
    upload.array("images", 10),
    accessoriesController.updateaccessorie
  )
  .delete(accessoriesController.deleteaccessorie);

export default router;