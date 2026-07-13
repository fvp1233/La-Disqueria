import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/products";
const FALLBACK_IMAGE = "https://placehold.co/600x600?text=La+Disqueria";

const normalizeProduct = (item) => ({
  id: item._id,
  type: item.type,
  slug: item._id,
  album: item.album,
  artist: item.artist,
  artistId: item.artistId,
  price: item.price ?? 0,
  coverImage: item.coverImage || FALLBACK_IMAGE,
  vinylImage: item.coverImage || FALLBACK_IMAGE,
  genre: item.genre || "",
  isAvailable: item.isAvailable,
});

// Trae una página de productos (vinilos + cds + tocadiscos + accesorios)
// ya filtrada/ordenada por el backend vía /api/products.
const useProducts = ({
  page = 1,
  limit = 12,
  type,
  genre,
  artistId,
  isAvailable,
  sort,
} = {}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (type) params.set("type", type);
        if (genre) params.set("genre", genre);
        if (artistId) params.set("artistId", artistId);
        if (isAvailable !== undefined) params.set("isAvailable", isAvailable);
        if (sort) params.set("sort", sort);

        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error("No se pudieron obtener los productos");

        const result = await response.json();
        setProducts(result.data.map(normalizeProduct));
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err.message || "Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, type, genre, artistId, isAvailable, sort]);

  return { products, total, totalPages, loading, error };
};

export default useProducts;
