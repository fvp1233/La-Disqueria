import express from 'express'
import turntablesController from '../../controllers/turntables/turntablesController.js'
import upload from '../../utils/CloudinaryConfig.js'
const router = express.Router()

router.route('/')
.get(turntablesController.getTurntables)
.post(upload.array("images"), turntablesController.insertTurntable)

router.route("/:id")
.put(upload.array("images"), turntablesController.updateTurntable)
.delete(turntablesController.deleteTurntable)
export default router