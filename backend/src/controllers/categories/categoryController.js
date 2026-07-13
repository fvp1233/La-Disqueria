import categoryModel from "../../models/categories/category.js";
import vinylModel from "../../models/vinyls/vinyl.js";
import cdsModel from "../../models/cds/cds.js";

const categoryController = {};

// Cuenta discos y CDs cuyo género coincide (sin distinguir mayúsculas) con la categoría,
// para que "albumCount" refleje el catálogo real en vez de un número fijo.
const countAlbumsForCategory = async (name) => {
  const genreRegex = new RegExp(name, "i");

  const [vinylCount, cdCount] = await Promise.all([
    vinylModel.countDocuments({ genre: genreRegex }),
    cdsModel.countDocuments({ genre: genreRegex }),
  ]);

  return vinylCount + cdCount;
};

categoryController.getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    const withAlbumCount = await Promise.all(
      categories.map(async (category) => ({
        ...category.toObject(),
        albumCount: await countAlbumsForCategory(category.name),
      }))
    );

    res.json(withAlbumCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

categoryController.getCategoryBySlug = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const albumCount = await countAlbumsForCategory(category.name);

    res.json({ ...category.toObject(), albumCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

categoryController.insertCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const existingCategory = await categoryModel.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "A category with this slug already exists" });
    }

    const payload = new categoryModel({ name, slug, description });
    await payload.save();

    return res.status(201).json({
      message: "Category saved",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

categoryController.updateCategory = async (req, res) => {
  try {
    const response = await categoryModel.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const payload = { name, slug, description };

    await categoryModel.findByIdAndUpdate(req.params.id, payload);

    return res.status(200).json({
      message: "Category updated",
      data: payload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

categoryController.deleteCategory = async (req, res) => {
  try {
    const response = await categoryModel.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Category not found" });
    }

    await categoryModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default categoryController;
