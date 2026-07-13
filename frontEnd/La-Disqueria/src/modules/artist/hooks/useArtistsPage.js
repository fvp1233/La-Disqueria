import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/artists";
const DEBOUNCE_MS = 300;

const slugify = (name) => name.toLowerCase().trim().replace(/\s+/g, "-");

const normalizeArtist = (artist) => ({
  id: artist._id,
  name: artist.name,
  genres: artist.genre || [],
  image: artist.image || "",
  origin: artist.origin || "",
  biography: artist.biography || "",
  socialLinks: artist.social_links || {},
  slug: slugify(artist.name),
});

// Trae una página de artistas ya filtrada/buscada por el backend, para no
// descargar el listado completo cuando puede llegar a ser muy grande.
const useArtistsPage = ({ page = 1, limit = 12, search = "", genre = "" } = {}) => {
  const [artists, setArtists] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (search.trim()) params.set("search", search.trim());
        if (genre && genre !== "Todos los géneros") params.set("genre", genre);

        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error("No se pudieron obtener los artistas");

        const result = await response.json();
        if (cancelled) return;

        setArtists(result.data.map(normalizeArtist));
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (!cancelled) setError(err.message || "Error al cargar los artistas");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [page, limit, search, genre]);

  return { artists, total, totalPages, loading, error };
};

export default useArtistsPage;
