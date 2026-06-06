import accessoriesModel from "../../models/accessories/accessories";

import { v2 as cloudinary } from "cloudinary";

const accessoriesrController = {};

// OBTENER TODOS
accessorieController.getAllaccessories = async (req, res) => {
  try {
    const accessories = await accessorieModel.find();
    return res.status(200).json(accessories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// INSERTAR
accessorieController.insertaccessorie = async (req, res) => {
  try {
    const {
      name,
      brand,
      subtype,
      description,
      compatibleWith,
      material,
      price,
      tags,
      isAvailable,
    } = req.body;

    const imageUrls = [];
    const publicIds = [];

    if (req.files) {
      req.files.forEach((file) => {
        imageUrls.push(file.path);
        publicIds.push(file.filename);
      });
    }

    const newAccessorie = new accessorieModel({
      name,
      brand,
      subtype,
      description,
      compatibleWith: JSON.parse(compatibleWith || "[]"),
      material,
      price,
      images: imageUrls,
      public_ids: publicIds,
      tags: JSON.parse(tags || "[]"),
      isAvailable,
    });

    await newAccessorie.save();

    return res.status(200).json({
      message: "accessorie saved",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ACTUALIZAR
accessorieController.updateaccessorie = async (req, res) => {
  try {
    const accessorieFound = await accessorieModel.findById(req.params.id);

    if (!accessorieFound) {
      return res.status(404).json({
        message: "accessorie not found",
      });
    }

    const {
      name,
      brand,
      subtype,
      description,
      compatibleWith,
      material,
      price,
      tags,
      isAvailable,
    } = req.body;

    const updatedData = {
      name,
      brand,
      subtype,
      description,
      compatibleWith: compatibleWith
        ? JSON.parse(compatibleWith)
        : accessorieFound.compatibleWith,
      material,
      price,
      tags: tags ? JSON.parse(tags) : accessorieFound.tags,
      isAvailable,
    };

    // Si llegan nuevas imágenes
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes anteriores
      for (const publicId of accessorieFound.public_ids) {
        await cloudinary.uploader.destroy(publicId);
      }

      const imageUrls = [];
      const publicIds = [];

      req.files.forEach((file) => {
        imageUrls.push(file.path);
        publicIds.push(file.filename);
      });

      updatedData.images = imageUrls;
      updatedData.public_ids = publicIds;
    }

    await accessorieModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: "accessorie updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ELIMINAR
accessorieController.deleteaccessorie = async (req, res) => {
  try {
    const accessorieFound = await accessorieModel.findById(req.params.id);

    if (!accessorieFound) {
      return res.status(404).json({
        message: "accessorie not found",
      });
    }

    // Eliminar imágenes de Cloudinary
    if (accessorieFound.public_ids?.length > 0) {
      for (const publicId of accessorieFound.public_ids) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await accessorieModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "accessorie deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default accessorieController;