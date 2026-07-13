import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:4000/api";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=La+Disqueria";

const firstImageUrl = (images) => {
  if (!Array.isArray(images) || images.length === 0) return null;
  const cover = images.find((img) => img?.isCover) || images[0];
  return typeof cover === "string" ? cover : cover?.image || null;
};

// Algunos documentos sembrados usan "is_available" en vez de "isAvailable"
// y "title" en vez de "tittle" (el campo declarado en el esquema tiene un typo).
const resolveAvailability = (item) => item.isAvailable ?? item.is_available ?? true;

// artistId viene populado (ver vinylController/cdsController) cuando el disco
// tiene un artista real asociado en la colección "artists".
const resolveArtistName = (artistId) =>
  artistId && typeof artistId === "object" ? artistId.name || "" : "";

const resolveArtistId = (artistId) =>
  artistId && typeof artistId === "object" ? artistId._id : artistId || "";

const normalizeVinyl = (item) => ({
  id: item._id,
  type: "vinyl",
  slug: item._id,
  album: item.tittle || item.title || "Sin título",
  artist: resolveArtistName(item.artistId),
  artistId: resolveArtistId(item.artistId),
  price: item.price ?? 0,
  coverImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  vinylImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  genre: item.genre || "",
  isAvailable: resolveAvailability(item),
  createdAt: item.createdAt,
  raw: item,
});

const normalizeCd = (item) => ({
  id: item._id,
  type: "cd",
  slug: item._id,
  album: item.title || "Sin título",
  artist: resolveArtistName(item.artistId),
  artistId: resolveArtistId(item.artistId),
  price: item.price ?? 0,
  coverImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  vinylImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  genre: Array.isArray(item.genre) ? item.genre.join(", ") : item.genre || "",
  isAvailable: resolveAvailability(item),
  createdAt: item.createdAt,
  raw: item,
});

const normalizeTurntable = (item) => ({
  id: item._id,
  type: "turntable",
  slug: item._id,
  album: `${item.brand || ""} ${item.model || ""}`.trim() || "Sin título",
  artist: "",
  artistId: "",
  price: item.price ?? 0,
  coverImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  vinylImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  genre: "Tocadiscos",
  isAvailable: resolveAvailability(item),
  createdAt: item.createdAt,
  raw: item,
});

const normalizeAccessory = (item) => ({
  id: item._id,
  type: "accessory",
  slug: item._id,
  album: item.name || "Sin título",
  artist: item.brand || "",
  artistId: "",
  price: item.price ?? 0,
  coverImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  vinylImage: firstImageUrl(item.images) || FALLBACK_IMAGE,
  genre: "Accesorio",
  isAvailable: resolveAvailability(item),
  createdAt: item.createdAt,
  raw: item,
});

const useCatalog = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError("");

      const [vinylsRes, cdsRes, turntablesRes, accessoriesRes] = await Promise.all([
        fetch(`${BASE_URL}/vinyls`),
        fetch(`${BASE_URL}/cds`),
        fetch(`${BASE_URL}/turntables`),
        fetch(`${BASE_URL}/accessories`),
      ]);

      if (!vinylsRes.ok) throw new Error("No se pudieron obtener los vinilos");
      if (!cdsRes.ok) throw new Error("No se pudieron obtener los CDs");
      if (!turntablesRes.ok) throw new Error("No se pudieron obtener los tocadiscos");
      if (!accessoriesRes.ok) throw new Error("No se pudieron obtener los accesorios");

      const [vinyls, cds, turntables, accessories] = await Promise.all([
        vinylsRes.json(),
        cdsRes.json(),
        turntablesRes.json(),
        accessoriesRes.json(),
      ]);

      setCatalog([
        ...vinyls.map(normalizeVinyl),
        ...cds.map(normalizeCd),
        ...turntables.map(normalizeTurntable),
        ...accessories.map(normalizeAccessory),
      ]);
    } catch (err) {
      setError(err.message || "Error al cargar el catálogo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  return { catalog, loading, error, fetchCatalog };
};

export default useCatalog;
