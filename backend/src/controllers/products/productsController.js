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

export default productsController;
