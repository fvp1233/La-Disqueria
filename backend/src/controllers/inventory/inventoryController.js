import inventoryModel from '../../models/inventory/inventory.js'

const inventoryController = {}
inventoryController.getInventory = async (req, res) => {
    try {
        // Sin populate por ahora
        const response = await inventoryModel.find()

        if (!response) {
            return res.status(404).json({ message: 'Inventory not found' })
        }

        res.json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

inventoryController.insertInventory = async (req, res) => {
    try {
        const { productId, productType, sku, stock, location, supplierId } = req.body

        if (!productId || !productType || !sku || !stock || !location || !supplierId) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (!['vinyl', 'turntable', 'cd', 'accessory'].includes(productType)) {
            return res.status(400).json({
                message: `Invalid product type: ${productType}, product types allowed: vinyl, turntable, cd, accessory`
            })
        }

        const payload = new inventoryModel({
            productId,
            productType,
            sku,
            stock,
            location,
            supplierId
        })

        await payload.save()

        return res.status(201).json({
            message: 'Inventory saved',
            data: payload
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

inventoryController.updateInventory = async (req, res) => {
    try {
        const response = await inventoryModel.findById(req.params.id)
        if (!response) {
            return res.status(404).json({ message: 'Inventory not found' })
        }

        const { productId, productType, sku, stock, location, supplierId } = req.body

        if (!productId || !productType || !sku || !stock || !location || !supplierId) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        if (!['vinyl', 'turntable', 'cd', 'accessory'].includes(productType)) {
            return res.status(400).json({
                message: `Invalid product type: ${productType}, product types allowed: vinyl, turntable, cd, accessory`
            })
        }

        const payload = {
            productId,
            productType,
            sku,
            stock,
            location,
            supplierId
        }

        await inventoryModel.findByIdAndUpdate(req.params.id, payload)

        return res.status(200).json({
            message: 'Inventory updated',
            data: payload
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

inventoryController.deleteInventory = async (req, res) => {
    try {
        const response = await inventoryModel.findById(req.params.id)
        if (!response) {
            return res.status(404).json({ message: 'Inventory not found' })
        }

        await inventoryModel.findByIdAndDelete(req.params.id)

        return res.status(200).json({ message: 'Inventory deleted' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export default inventoryController