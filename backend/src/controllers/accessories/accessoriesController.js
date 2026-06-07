import accessoriesModel from "../../models/accessories/accessories.js";
import { v2 as cloudinary } from "cloudinary";

const accessoriesController = {};

// OBTENER TODOS
accessoriesController.getAllaccessories = async (req, res) => {
  try {
    const accessories = await accessoriesModel.find();
    return res.status(200).json(accessories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// INSERTAR
accessoriesController.insertaccessorie = async (req, res) => {
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

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        imageUrls.push(file.path);
        publicIds.push(file.filename);
      });
    }

    const newAccessorie = new accessoriesModel({
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

// GET BY ID
accessoriesController.getAccessorieById = async (req, res) => {
  try {
    const accessorie = await accessoriesModel.findById(req.params.id);

    if (!accessorie) {
      return res.status(404).json({
        message: "accessorie not found",
      });
    }

    return res.status(200).json(accessorie);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ACTUALIZAR (FIXED + SAFE + CLOUDINARY SAFE)
accessoriesController.updateaccessorie = async (req, res) => {
  try {
    const accessorieFound = await accessoriesModel.findById(req.params.id);

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
      material,
      price,
      isAvailable,
      compatibleWith: compatibleWith
        ? JSON.parse(compatibleWith)
        : accessorieFound.compatibleWith,
      tags: tags
        ? JSON.parse(tags)
        : accessorieFound.tags,
    };

    // SI HAY NUEVAS IMÁGENES
    if (req.files && req.files.length > 0) {
      // borrar viejas imágenes (SAFE CHECK)
      if (Array.isArray(accessorieFound.public_ids)) {
        for (const publicId of accessorieFound.public_ids) {
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }

      const imageUrls = [];
      const publicIds = [];

      req.files.forEach((file) => {
        imageUrls.push(file.path);
        publicIds.push(file.filename);
      });

      updatedData.images = imageUrls;
      updatedData.public_ids = publicIds;
    } else {
      // mantener imágenes existentes
      updatedData.images = accessorieFound.images;
      updatedData.public_ids = accessorieFound.public_ids;
    }

    await accessoriesModel.findByIdAndUpdate(
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

// DELETE (SAFE)
accessoriesController.deleteaccessorie = async (req, res) => {
  try {
    const accessorieFound = await accessoriesModel.findById(req.params.id);

    if (!accessorieFound) {
      return res.status(404).json({
        message: "accessorie not found",
      });
    }

    if (Array.isArray(accessorieFound.public_ids)) {
      for (const publicId of accessorieFound.public_ids) {
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await accessoriesModel.findByIdAndDelete(req.params.id);

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

export default accessoriesController;