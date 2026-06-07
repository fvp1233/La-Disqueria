import cdsModel from '../../models/cds/cds.js'
import { v2 as cloudinary } from 'cloudinary'

const cdsController = {}

cdsController.getCds = async (req, res) => {
    try {
        const response = await cdsModel.find()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

cdsController.insertCd = async (req, res) => {
    try {
        const {
            title,
            artistId,
            label,
            genre,
            year,
            format,
            tracks,
            album_duration,
            edition,
            price,
            tags,
            isAvailable
        } = req.body

        // Mapea cada archivo subido a public_id e image
        const images = req.files.map(file => ({
            public_id: file.filename,
            image: file.path
        }))

        const payload = new cdsModel({
            title,
            artistId,
            label,
            genre,
            year,
            format,
            tracks,
            album_duration,
            edition,
            price,
            images,
            tags,
            isAvailable
        })

        await payload.save()
        return res.status(201).json({ message: "CD created successfully", data: payload })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

cdsController.deleteCd = async (req, res) => {
    try {
        const response = await cdsModel.findById(req.params.id)
        if (!response) {
            return res.status(404).json({ message: "CD not found" })
        }

        // Por cada imágen que haye, se elimina esa imágen
        for (const img of response.images) {
            await cloudinary.uploader.destroy(img.public_id)
        }

        await cdsModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "CD deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

cdsController.updateCd = async (req, res) => {
    try {
        const cdFound = await cdsModel.findById(req.params.id)
        if (!cdFound) {
            return res.status(404).json({ message: "CD not found" })
        }

        const {
            title,
            artistId,
            label,
            genre,
            year,
            format,
            tracks,
            album_duration,
            edition,
            price,
            tags,
            isAvailable
        } = req.body

        const payload = {
            title,
            artistId,
            label,
            genre,
            year,
            format,
            tracks,
            album_duration,
            edition,
            price,
            tags,
            isAvailable
        }

        // Si llegan nuevas imágenes, elimina las anteriores y sube las nuevas
        if (req.files && req.files.length > 0) {
            for (const img of cdFound.images) {
                await cloudinary.uploader.destroy(img.public_id)
            }

            payload.images = req.files.map(file => ({
                public_id: file.filename,
                image: file.path
            }))
        }

        const cdUpdated = await cdsModel.findByIdAndUpdate(req.params.id, payload, { new: true })
        return res.status(200).json({ message: "CD updated successfully", data: cdUpdated })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

export default cdsController