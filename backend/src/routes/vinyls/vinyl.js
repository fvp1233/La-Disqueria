import express from "express"
import vinylController from "../../controllers/vinyls/vinylController.js"
import upload from "../../utils/CloudinaryConfig.js"

const router = express.Router();

router.route("/").get(vinylController.getVinyls).post(upload.array("images") , vinylController.inserVinyl);

router.route("/:id").delete(vinylController.deleteVinyl).put(upload.array("images") , vinylController.updateVinyl);

export default router