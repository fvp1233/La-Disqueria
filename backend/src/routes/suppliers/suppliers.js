import express from 'express'
import suppliersController from '../../controllers/suppliers/suppliersController.js'
const router = express.Router()

router.route("/")
.get(suppliersController.getSuppliers)
.post(suppliersController.insertSuppliers)

router.route("/:id")
.put(suppliersController.updateSupplier)
.delete(suppliersController.deleteSupplier)

export default router