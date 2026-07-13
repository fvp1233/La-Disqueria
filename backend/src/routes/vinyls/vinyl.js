import express from "express"
import vinylController from "../../controllers/vinyls/vinylController.js"
import upload from "../../utils/CloudinaryConfig.js"
import { validateAuthCookie } from "../../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/").get(vinylController.getVinyls).post(validateAuthCookie(["admin"]), upload.array("images") , vinylController.inserVinyl);

router.route("/:id").delete(validateAuthCookie(["admin"]), vinylController.deleteVinyl).put(validateAuthCookie(["admin"]), upload.array("images") , vinylController.updateVinyl);

export default router