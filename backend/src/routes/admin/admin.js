import express from 'express'
import adminController from '../../controllers/admin/adminController.js'
import { validateAuthCookie } from '../../middlewares/authMiddleware.js'

const router = express.Router()

router.route("/")
  .get(validateAuthCookie(["admin"]), adminController.getAdmins)

router.route("/:id")
    .put(validateAuthCookie(["admin"]), adminController.updateAdmin)
    .delete(validateAuthCookie(["admin"]), adminController.deleteAdmin)
export default router