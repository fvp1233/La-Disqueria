import artistModel from "../../models/artists/artist.js";
import { v2 as cloudinary } from "cloudinary";

const artistController = {};

artistController.getArtists = async (req, res) => {
  try {
    const { page, limit, search, genre } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (genre) filter.genre = { $regex: genre, $options: "i" };

    // Sin page/limit se mantiene el comportamiento original (array completo),
    // ya que el admin y el navbar de la tienda dependen de tener el listado
    // completo sin paginar.
    if (!page && !limit) {
      const response = await artistModel.find(filter);
      return res.json(response);
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 12);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      artistModel.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
      artistModel.countDocuments(filter),
    ]);

    return res.json({
      data,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      limit: limitNum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

artistController.getArtistById = async (req, res) => {
  try {
    const response = await artistModel.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

artistController.insertArtist = async (req, res) => {
  try {
    const { name, genre, origin, biography, social_links } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const payload = new artistModel({
      name,
      genre: JSON.parse(genre || "[]"),
      origin,
      biography,
      social_links: JSON.parse(social_links || "{}"),
      image: req.file?.path,
      public_id: req.file?.filename,
    });
    await payload.save();

    return res.status(201).json({
      message: "Artist saved",
      data: payload,
    });
  } catch (error) {
    console.log("Error inserting artist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

artistController.updateArtist = async (req, res) => {
  try {
    const artistFound = await artistModel.findById(req.params.id);
    if (!artistFound) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const { name, genre, origin, biography, social_links } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const payload = {
      name,
      genre: JSON.parse(genre || "[]"),
      origin,
      biography,
      social_links: JSON.parse(social_links || "{}"),
    };

    // Si sube una nueva imagen, elimina la anterior en Cloudinary y guarda la nueva
    if (req.file) {
      if (artistFound.public_id) {
        await cloudinary.uploader.destroy(artistFound.public_id);
      }
      payload.image = req.file.path;
      payload.public_id = req.file.filename;
    }

    await artistModel.findByIdAndUpdate(req.params.id, payload);

    return res.status(200).json({
      message: "Artist updated",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

artistController.deleteArtist = async (req, res) => {
  try {
    const response = await artistModel.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (response.public_id) {
      await cloudinary.uploader.destroy(response.public_id);
    }

    await artistModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Artist deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default artistController;
