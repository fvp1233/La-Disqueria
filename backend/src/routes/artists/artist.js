import express from "express";
import artistController from "../../controllers/artists/artistController.js";
import upload from "../../utils/CloudinaryConfig.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(artistController.getArtists)
  .post(validateAuthCookie(["admin"]), upload.single("image"), artistController.insertArtist);

router.route("/:id")
  .get(artistController.getArtistById)
  .put(validateAuthCookie(["admin"]), upload.single("image"), artistController.updateArtist)
  .delete(validateAuthCookie(["admin"]), artistController.deleteArtist);

export default router;
