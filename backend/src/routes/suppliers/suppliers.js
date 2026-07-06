import express from 'express'
import suppliersController from '../../controllers/suppliers/suppliersController.js'
import { validateAuthCookie } from '../../middlewares/authMiddleware.js'
const router = express.Router()

router.route("/")
.get(validateAuthCookie(["admin"]), suppliersController.getSuppliers)
.post(validateAuthCookie(["admin"]), suppliersController.insertSuppliers)

router.route("/:id")
.put(validateAuthCookie(["admin"]), suppliersController.updateSupplier)
.delete(validateAuthCookie(["admin"]), suppliersController.deleteSupplier)

export default router