import vinylModel from "../../models/vinyls/vinyl.js"
import { v2 as cloudinary } from "cloudinary"

const vinylController = {};

vinylController.getVinyls = async (req, res) => {
    try {
        const vinyls = await vinylModel.find().populate("artistId");
        return res.status(200).json(vinyls)

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

vinylController.inserVinyl = async (req, res) => {
    try {
        const {
            tittle,
            artist_id,
            label,
            genre,
            year,
            format,
            speed,
            size,
            color,
            condition,
            tracklist,
            price,
            tags,
            isAvailable
        } = req.body

        let imagesArray = [];

        //Si trae imagenes
        if (req.files && req.files.length > 0) {
            imagesArray = req.files.map((file, index) => {
                return {
                    image: file.path, //url que me genera cloudinary
                    public_id: file.filename, // el id de cada imagen
                    isCover: index === 0 // por defecto dejo que la primera imagen sea la del cover
                }
            })
        }

        const newVinyl = new vinylModel({
            tittle,
            artist_id,
            label,
            genre,
            year,
            format,
            speed,
            size,
            color,
            condition,
            tracklist,
            price,
            tags,
            isAvailable: true,
            images: imagesArray
        });
        await newVinyl.save();
        return res.status(200).json({ message: "Vinyl saved" })

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

vinylController.updateVinyl = async (req, res) => {
    try {
        const vinylFound = await vinylModel.findById(req.params.id);
        if (!vinylFound) {
            return res.status(400).json({ message: "Vinyl not found" })
        }

        const {
            tittle,
            artist_id,
            label,
            genre,
            year,
            format,
            speed,
            size,
            color,
            condition,
            tracklist,
            price,
            tags,
            isAvailable
        } = req.body;

        const updatedData = {
            tittle,
            artist_id,
            label,
            genre,
            year,
            format,
            speed,
            size,
            color,
            condition,
            tracklist,
            price,
            tags,
            isAvailable
        };

        if (req.files && req.files.length > 0) {
            for (const img of vinylFound.images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        const newImagesArray = req.files.map((file, index) => ({
            image: file.path,
            public_id: file.filename,
            isCover: index === 0
        }))
        updatedData.images = newImagesArray;

        const vinylUpdated = await vinylModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        return res.status(200).json({ message: "Vinyl updated" });

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

vinylController.deleteVinyl = async (req, res) => {
    try {

        const vinylFound = await vinylModel.findById(req.params.id);
        if (!vinylFound) {
            return res.status(400).json({ message: "Vinyl not found" })
        }

        if (vinylFound.images && vinylFound.images.length > 0) {
            for (const img of vinylFound.images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        await vinylModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Vinyl deleted" });

    } catch (error) {

        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default vinylController