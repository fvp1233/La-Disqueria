import express from 'express'
import inventoryController from '../../controllers/inventory/inventoryController.js'
import { validateAuthCookie } from '../../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(validateAuthCookie(["admin"]), inventoryController.getInventory)
    .post(validateAuthCookie(["admin"]), inventoryController.insertInventory)

router.route('/:id')
    .put(validateAuthCookie(["admin"]), inventoryController.updateInventory)
    .delete(validateAuthCookie(["admin"]), inventoryController.deleteInventory)

export default router