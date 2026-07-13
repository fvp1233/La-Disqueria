import express from 'express'
import cdsController from '../../controllers/cds/cdsController.js'
import upload from '../../utils/CloudinaryConfig.js'
import { validateAuthCookie } from '../../middlewares/authMiddleware.js'
const router = express.Router()

router.route("/")
.get(cdsController.getCds)
.post(validateAuthCookie(["admin"]), upload.array("images"),cdsController.insertCd)

router.route("/:id")
.put(validateAuthCookie(["admin"]), upload.array("images"),cdsController.updateCd)
.delete(validateAuthCookie(["admin"]), cdsController.deleteCd)

export default router