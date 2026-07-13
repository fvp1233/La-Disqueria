import express from "express";
import genreController from "../../controllers/genres/genreController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(genreController.getGenres)
  .post(validateAuthCookie(["admin"]), genreController.insertGenre);

router.route("/:id")
  .put(validateAuthCookie(["admin"]), genreController.updateGenre)
  .delete(validateAuthCookie(["admin"]), genreController.deleteGenre);

export default router;
