import turntablesModel from '../../models/turntables/turntables.js'
import { v2 as cloudinary } from 'cloudinary'

const turntablesController = {}

turntablesController.getTurntables = async (req, res) => {
    try {
        const response = await turntablesModel.find()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

turntablesController.insertTurntable = async (req, res) => {
    try {
        const {
            brand,
            model,
            type,
            description,
            specs,
            warranty,
            price,
            tags,
            isAvailable
        } = req.body

        const images = req.files.map(file => ({
            public_id: file.filename,
            image: file.path
        }))

        const payload = new turntablesModel({
            brand,
            model,
            type,
            description,
            specs,
            warranty,
            price,
            images,
            tags,
            isAvailable
        })

        await payload.save()
        return res.status(201).json({ message: "Turntable created successfully", data: payload })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

turntablesController.deleteTurntable = async (req, res) => {
    try {
        const response = await turntablesModel.findById(req.params.id)
        if (!response) {
            return res.status(404).json({ message: "Turntable not found" })
        }

        for (const img of response.images) {
            await cloudinary.uploader.destroy(img.public_id)
        }

        await turntablesModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Turntable deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

turntablesController.updateTurntable = async (req, res) => {
    try {
        const turntableFound = await turntablesModel.findById(req.params.id)
        if (!turntableFound) {
            return res.status(404).json({ message: "Turntable not found" })
        }

        const {
            brand,
            model,
            type,
            description,
            specs,
            warranty,
            price,
            tags,
            isAvailable
        } = req.body

        const payload = {
            brand,
            model,
            type,
            description,
            specs,
            warranty,
            price,
            tags,
            isAvailable
        }

        if (req.files && req.files.length > 0) {
            for (const img of turntableFound.images) {
                await cloudinary.uploader.destroy(img.public_id)
            }

            payload.images = req.files.map(file => ({
                public_id: file.filename,
                image: file.path
            }))
        }

        const turntableUpdated = await turntablesModel.findByIdAndUpdate(req.params.id, payload, { new: true })
        return res.status(200).json({ message: "Turntable updated successfully", data: turntableUpdated })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

export default turntablesController