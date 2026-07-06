import express from 'express'
import turntablesController from '../../controllers/turntables/turntablesController.js'
import upload from '../../utils/CloudinaryConfig.js'
import { validateAuthCookie } from '../../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/')
.get(turntablesController.getTurntables)
.post(validateAuthCookie(["admin"]), upload.array("images"), turntablesController.insertTurntable)

router.route("/:id")
.put(validateAuthCookie(["admin"]), upload.array("images"), turntablesController.updateTurntable)
.delete(validateAuthCookie(["admin"]), turntablesController.deleteTurntable)
export default router