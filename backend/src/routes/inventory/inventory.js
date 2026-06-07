import express from 'express'
import inventoryController from '../../controllers/inventory/inventoryController.js'

const router = express.Router()

router.route('/')
    .get(inventoryController.getInventory)
    .post(inventoryController.insertInventory)

router.route('/:id')
    .put(inventoryController.updateInventory)
    .delete(inventoryController.deleteInventory)

export default router