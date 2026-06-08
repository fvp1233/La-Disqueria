import express from 'express'
import cdsController from '../../controllers/cds/cdsController.js'
import upload from '../../utils/CloudinaryConfig.js'
const router = express.Router()

router.route("/")
.get(cdsController.getCds)
.post(upload.array("images"),cdsController.insertCd)

router.route("/:id")
.put(upload.array("images"),cdsController.updateCd)
.delete(cdsController.deleteCd)

export default router