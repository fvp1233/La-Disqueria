import { useState } from "react";

export function ArtistsSearchBar({ onSearch, onGenreChange, totalArtists = 1200 }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("A - Z");

  const genres = [
    "Todos los géneros",
    "Rock",
    "Pop",
    "Hip Hop",
    "Jazz",
    "Electrónica",
    "Indie",
    "Soul",
    "Grunge",
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="px-12 py-6 bg-white border-b border-gray-100">
      {/* Barra de búsqueda + filtro género */}
      <div className="flex gap-4 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="#999" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar artista..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 outline-none focus:border-[#E8602A] transition-colors"
          />
        </div>

        {/* Genre dropdown */}
        <select
          onChange={(e) => onGenreChange?.(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded text-sm text-gray-600 outline-none focus:border-[#E8602A] transition-colors cursor-pointer appearance-none pr-8 bg-white"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Resultados + ordenar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Explora más de{" "}
          <span className="text-[#E8602A] font-semibold">{totalArtists.toLocaleString()}</span>{" "}
          artistas
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs text-gray-600 border-none outline-none cursor-pointer bg-transparent font-medium"
          >
            <option>A - Z</option>
            <option>Z - A</option>
            <option>Más popular</option>
            <option>Más reciente</option>
          </select>
        </div>
      </div>
    </div>
  );
}