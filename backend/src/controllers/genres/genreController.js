import genreModel from "../../models/genres/genre.js";

const genreController = {};

genreController.getGenres = async (req, res) => {
  try {
    const response = await genreModel.find().sort({ name: 1 });
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

genreController.insertGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingGenre = await genreModel.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existingGenre) {
      return res.status(400).json({ message: "This genre already exists" });
    }

    const payload = new genreModel({ name });
    await payload.save();

    return res.status(201).json({
      message: "Genre saved",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

genreController.updateGenre = async (req, res) => {
  try {
    const response = await genreModel.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Genre not found" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    await genreModel.findByIdAndUpdate(req.params.id, { name });

    return res.status(200).json({
      message: "Genre updated",
      data: { name },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

genreController.deleteGenre = async (req, res) => {
  try {
    const response = await genreModel.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Genre not found" });
    }

    await genreModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Genre deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default genreController;
