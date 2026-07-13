import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/artists";

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

const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudieron obtener los artistas");

      const data = await response.json();
      setArtists(data.map(normalizeArtist));
    } catch (err) {
      setError(err.message || "Error al cargar los artistas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return { artists, loading, error, fetchArtists };
};

export default useArtists;
