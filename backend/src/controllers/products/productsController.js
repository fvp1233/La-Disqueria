import mongoose from "mongoose";
import vinylModel from "../../models/vinyls/vinyl.js";
import cdsModel from "../../models/cds/cds.js";
import turntablesModel from "../../models/turntables/turntables.js";
import accessoriesModel from "../../models/accessories/accessories.js";

const productsController = {};

// El campo genre puede ser String (vinilos) o [String] (cds); esto lo
// normaliza a un único string para poder ordenar/mostrar igual en el front.
const genreExpr = {
  $cond: [
    { $isArray: "$genre" },
    {
      $reduce: {
        input: "$genre",
        initialValue: "",
        in: {
          $concat: [
            "$$value",
            { $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
            "$$this",
          ],
        },
      },
    },
    { $ifNull: ["$genre", ""] },
  ],
};

const artistLookup = {
  $lookup: {
    from: "artists",
    localField: "artistId",
    foreignField: "_id",
    as: "artistDoc",
  },
};

const buildVinylPipeline = ({ genre, artistId, isAvailable }) => {
  const match = {};
  if (genre) match.genre = { $regex: genre, $options: "i" };
  if (artistId) match.artistId = new mongoose.Types.ObjectId(artistId);
  if (isAvailable !== undefined) match.isAvailable = isAvailable;

  return [
    { $match: match },
    artistLookup,
    {
      $project: {
        type: { $literal: "vinyl" },
        album: { $ifNull: ["$tittle", "Sin título"] },
        artist: { $ifNull: [{ $arrayElemAt: ["$artistDoc.name", 0] }, ""] },
        artistId: { $ifNull: ["$artistId", ""] },
        genre: genreExpr,
        price: { $ifNull: ["$price", 0] },
        coverImage: { $arrayElemAt: ["$images.image", 0] },
        isAvailable: { $ifNull: ["$isAvailable", true] },
      },
    },
  ];
};

const buildCdPipeline = ({ genre, artistId, isAvailable }) => {
  const match = {};
  if (genre) match.genre = { $regex: genre, $options: "i" };
  if (artistId) match.artistId = new mongoose.Types.ObjectId(artistId);
  if (isAvailable !== undefined) match.isAvailable = isAvailable;

  return [
    { $match: match },
    artistLookup,
    {
      $project: {
        type: { $literal: "cd" },
        album: { $ifNull: ["$title", "Sin título"] },
        artist: { $ifNull: [{ $arrayElemAt: ["$artistDoc.name", 0] }, ""] },
        artistId: { $ifNull: ["$artistId", ""] },
        genre: genreExpr,
        price: { $ifNull: ["$price", 0] },
        coverImage: { $arrayElemAt: ["$images.image", 0] },
        isAvailable: { $ifNull: ["$isAvailable", true] },
      },
    },
  ];
};

const buildTurntablePipeline = ({ isAvailable }) => {
  const match = {};
  if (isAvailable !== undefined) match.isAvailable = isAvailable;

  return [
    { $match: match },
    {
      $project: {
        type: { $literal: "turntable" },
        album: {
          $trim: {
            input: { $concat: [{ $ifNull: ["$brand", ""] }, " ", { $ifNull: ["$model", ""] }] },
          },
        },
        artist: { $literal: "" },
        artistId: { $literal: "" },
        genre: { $literal: "Tocadiscos" },
        price: { $ifNull: ["$price", 0] },
        coverImage: { $arrayElemAt: ["$images.image", 0] },
        isAvailable: { $ifNull: ["$isAvailable", true] },
      },
    },
  ];
};

const buildAccessoryPipeline = ({ isAvailable }) => {
  const match = {};
  if (isAvailable !== undefined) match.isAvailable = isAvailable;

  return [
    { $match: match },
    {
      $project: {
        type: { $literal: "accessory" },
        album: { $ifNull: ["$name", "Sin título"] },
        artist: { $ifNull: ["$brand", ""] },
        artistId: { $literal: "" },
        genre: { $literal: "Accesorio" },
        price: { $ifNull: ["$price", 0] },
        coverImage: { $arrayElemAt: ["$images", 0] },
        isAvailable: { $ifNull: ["$isAvailable", true] },
      },
    },
  ];
};

// género/artista solo existen en vinilos y cds: si se filtra por alguno de
// los dos, tocadiscos y accesorios quedan fuera de la unión.
const TYPE_BUILDERS = {
  vinyl: { model: vinylModel, build: buildVinylPipeline, supportsGenreArtist: true },
  cd: { model: cdsModel, build: buildCdPipeline, supportsGenreArtist: true },
  turntable: { model: turntablesModel, build: buildTurntablePipeline, supportsGenreArtist: false },
  accessory: { model: accessoriesModel, build: buildAccessoryPipeline, supportsGenreArtist: false },
};

const SORT_MAP = {
  az: { album: 1 },
  za: { album: -1 },
  "price-low": { price: 1 },
  "price-high": { price: -1 },
};

// SELECT - listado paginado de productos (vinilos + cds + tocadiscos +
// accesorios) unificados en una sola colección virtual vía $unionWith, con
// filtros de tipo/género/artista/disponibilidad y orden. Público: lo usa
// la tienda (no el panel admin, que sigue consumiendo /api/vinyls, etc).
productsController.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      genre,
      artistId,
      isAvailable,
      sort = "az",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 12);
    const skip = (pageNum - 1) * limitNum;

    const filters = {
      genre: genre || undefined,
      artistId: artistId || undefined,
      isAvailable:
        isAvailable === "true" ? true : isAvailable === "false" ? false : undefined,
    };

    const hasGenreOrArtistFilter = Boolean(filters.genre || filters.artistId);

    let typesToQuery;
    if (type) {
      if (!TYPE_BUILDERS[type]) {
        return res.status(400).json({ message: "Tipo de producto inválido" });
      }
      typesToQuery = [type];
    } else {
      typesToQuery = Object.keys(TYPE_BUILDERS).filter(
        (t) => !hasGenreOrArtistFilter || TYPE_BUILDERS[t].supportsGenreArtist
      );
    }

    const [firstType, ...restTypes] = typesToQuery;
    const pipeline = [...TYPE_BUILDERS[firstType].build(filters)];

    restTypes.forEach((t) => {
      pipeline.push({
        $unionWith: {
          coll: TYPE_BUILDERS[t].model.collection.name,
          pipeline: TYPE_BUILDERS[t].build(filters),
        },
      });
    });

    const sortStage = SORT_MAP[sort] || SORT_MAP.az;
    pipeline.push({ $sort: sortStage });

    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [...pipeline, { $skip: skip }, { $limit: limitNum }];

    const [countResult, data] = await Promise.all([
      TYPE_BUILDERS[firstType].model.aggregate(countPipeline),
      TYPE_BUILDERS[firstType].model.aggregate(dataPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return res.status(200).json({
      data,
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
      limit: limitNum,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const firstCoverImage = (images) => {
  if (!Array.isArray(images) || images.length === 0) return null;
  const cover = images.find((img) => img?.isCover) || images[0];
  return typeof cover === "string" ? cover : cover?.image || null;
};

const joinGenre = (genre) =>
  Array.isArray(genre) ? genre.filter(Boolean).join(", ") : genre || "";

// SELECT - detalle de un producto individual resuelto contra la coleccion que
// corresponda a su id. Publico: lo usa la ficha de producto de la tienda.
productsController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const [vinyl, cd, turntable, accessory] = await Promise.all([
      vinylModel.findById(id).populate("artistId", "name").lean(),
      cdsModel.findById(id).populate("artistId", "name").lean(),
      turntablesModel.findById(id).lean(),
      accessoriesModel.findById(id).lean(),
    ]);

    if (vinyl) {
      return res.status(200).json({
        id: vinyl._id,
        type: "vinyl",
        album: vinyl.tittle || vinyl.title || "Sin título",
        artist: vinyl.artistId?.name || "",
        artistId: vinyl.artistId?._id || vinyl.artistId || "",
        genre: joinGenre(vinyl.genre),
        label: vinyl.label || "",
        year: vinyl.year || null,
        format: vinyl.format || "",
        color: vinyl.color || "",
        price: vinyl.price ?? 0,
        coverImage: firstCoverImage(vinyl.images),
        images: (vinyl.images || []).map((img) => img.image).filter(Boolean),
        trackList: vinyl.trackList || [],
        isAvailable: vinyl.isAvailable ?? true,
      });
    }

    if (cd) {
      return res.status(200).json({
        id: cd._id,
        type: "cd",
        album: cd.title || "Sin título",
        artist: cd.artistId?.name || "",
        artistId: cd.artistId?._id || cd.artistId || "",
        genre: joinGenre(cd.genre),
        label: cd.label || "",
        year: cd.year || "",
        format: cd.format || "",
        price: cd.price ?? 0,
        coverImage: firstCoverImage(cd.images),
        images: (cd.images || []).map((img) => img.image).filter(Boolean),
        trackList: cd.tracks || [],
        isAvailable: cd.isAvailable ?? true,
      });
    }

    if (turntable) {
      return res.status(200).json({
        id: turntable._id,
        type: "turntable",
        album: `${turntable.brand || ""} ${turntable.model || ""}`.trim() || "Sin título",
        artist: "",
        artistId: "",
        genre: "Tocadiscos",
        description: turntable.description || "",
        specs: turntable.specs || [],
        warranty: turntable.warranty || "",
        price: turntable.price ?? 0,
        coverImage: firstCoverImage(turntable.images),
        images: (turntable.images || []).map((img) => img.image).filter(Boolean),
        isAvailable: turntable.isAvailable ?? true,
      });
    }

    if (accessory) {
      return res.status(200).json({
        id: accessory._id,
        type: "accessory",
        album: accessory.name || "Sin título",
        artist: accessory.brand || "",
        artistId: "",
        genre: "Accesorio",
        description: accessory.description || "",
        material: accessory.material || "",
        compatibleWith: accessory.compatibleWith || [],
        price: accessory.price ?? 0,
        coverImage: firstCoverImage(accessory.images),
        images: (accessory.images || []).filter(Boolean),
        isAvailable: accessory.isAvailable ?? true,
      });
    }

    return res.status(404).json({ message: "Producto no encontrado" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productsController;
