import { Link } from "react-router-dom";

// Placeholder images por artista (en producción vendrían del backend)
const ARTIST_PLACEHOLDER_COLORS = {
    "The Beatles": "#8B7355",
    "Radiohead": "#6B7B8D",
    "Amy Winehouse": "#3D3D3D",
    "Kendrick Lamar": "#7A6E5F",
    "Pink Floyd": "#5A4E6B",
    "Daft Punk": "#2B2B2B",
    "Billie Eilish": "#B8A89A",
    "Miles Davis": "#4A4A4A",
    "Nirvana": "#6B7A5A",
    "The Rolling Stones": "#5C5C5C",
    "Arctic Monkeys": "#8A7A5C",
    "Madvillain": "#3D3D3D",
};

export function ArtistCard({ artist }) {
    const { name, genres = [], slug, image } = artist;
    const bgColor = ARTIST_PLACEHOLDER_COLORS[name] || "#6B6B6B";

    return (
        <div className="flex flex-col">
            {/* Imagen con vinilo superpuesto */}
            <div className="relative w-full  aspect-square overflow-hidden rounded-sm  group cursor-pointer">

                {/* Vinilo (detrás, se desliza en hover) */}
                <div
                    className="absolute right-0 top-[15%] w-[60%] h-[60%] rounded-full z-0 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-x-[0%] group-hover:translate-x-[30%]"
                    style={{
                        background:
                            "conic-gradient(from 50deg at 50% 50%, transparent 46%, rgba(255,255,255,0.1) 50%, transparent 56%), repeating-radial-gradient(circle, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 4px), #0a0a0a",
                            }}
                >
                    {/* Centro del disco con foto del artista */}
                    <div
                        className="w-[35%] h-[35%] rounded-full bg-cover bg-center shadow-[0_0_0_5px_#000]"
                        style={{ backgroundImage: image ? `url(${image})` : "none", backgroundColor: bgColor }}
                    />
                </div>

                {/* Foto artista (delante) */}
                <div className="relative top-[10%] z-5 w-70 h-70 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-3 group-hover:-rotate-3">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: bgColor }}
                        >
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="22" r="14" fill="rgba(255,255,255,0.3)" />
                                <ellipse cx="32" cy="56" rx="22" ry="14" fill="rgba(255,255,255,0.3)" />
                            </svg>
                        </div>
                    )}
                </div>

            </div>

            {/* Info artista */}
            <div className="mt-3">
                <p className="text-[13px] font-semibold text-[#1a1a1a]">{name}</p>
                <p className="text-[11px] text-[#777] mt-0.5">{genres.join(" · ")}</p>
                <Link
                    to={`/artistas/${slug || name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[11px] text-[#E8602A] font-medium mt-1.5 inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                    Ver discos →
                </Link>
            </div>
        </div>
    );
}