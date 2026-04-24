import { Link } from "react-router-dom";

const GENRE_CONFIGS = {
    Rock: {
        bg: "linear-gradient(135deg, #8B1A1A 0%, #2d2d2d 100%)",
        accentBg: "#E8602A",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M3 13 L3 3 L8 1 L8 8 M8 13 C8 14.1 7.1 15 6 15 C4.9 15 4 14.1 4 13 C4 11.9 4.9 11 6 11 C7.1 11 8 11.9 8 13Z" />
            </svg>
        ),
    },
    "Hip-Hop": {
        bg: "linear-gradient(135deg, #1a3a2a 0%, #0d0d0d 100%)",
        accentBg: "#E8602A",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M6 8 L8 6 L10 8 L8 10 Z" fill="white" />
            </svg>
        ),
    },
    Pop: {
        bg: "linear-gradient(135deg, #e8b4b8 0%, #f5c6c8 50%, #ffddd0 100%)",
        accentBg: "#E8602A",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <polygon points="8,2 9.5,6.5 14,6.5 10.5,9.5 11.5,14 8,11.5 4.5,14 5.5,9.5 2,6.5 6.5,6.5" />
            </svg>
        ),
    },
    Jazz: {
        bg: "linear-gradient(135deg, #1a2a3a 0%, #2a4a3a 100%)",
        accentBg: "#E8602A",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M3 12 L3 6 L8 4 L8 10 M8 12 C8 13.1 7.1 14 6 14 C4.9 14 4 13.1 4 12" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
        ),
    },
    Electrónica: {
        bg: "linear-gradient(135deg, #0d1a2a 0%, #1a2a1a 100%)",
        accentBg: "#E8602A",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <rect x="1" y="6" width="2" height="4" rx="1" />
                <rect x="4" y="4" width="2" height="8" rx="1" />
                <rect x="7" y="7" width="2" height="3" rx="1" />
                <rect x="10" y="5" width="2" height="6" rx="1" />
                <rect x="13" y="6" width="2" height="4" rx="1" />
            </svg>
        ),
    },
    Indie: {
        bg: "linear-gradient(135deg, #f5e6d0 0%, #e8d4b0 100%)",
        accentBg: "#E8602A",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.8" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                <rect x="2" y="10" width="5" height="4" rx="1" fill="white" opacity="0.6" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.8" />
            </svg>
        ),
    },
};

export function CategoryCard({ genre, albumCount, slug }) {
    const config = GENRE_CONFIGS[genre] || {
        bg: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",
        accentBg: "#E8602A",
        icon: null,
    };

    return (
        <Link to={`/categorias/${slug || genre.toLowerCase()}`} className="block group">
            <div
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md cursor-pointer"
                style={{ background: config.bg }}
            >
                {/* Icono flotante */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: config.accentBg }}>
                    {config.icon}
                </div>

                {/* Decoración de fondo */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-full border-2 border-white/30" />
                    <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-white/20" />
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border border-white/10" />
                </div>

                {/* Artista placeholder */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="28" r="16" fill="white" opacity="0.3" />
                        <ellipse cx="40" cy="62" rx="24" ry="16" fill="white" opacity="0.3" />
                    </svg>
                </div>

                {/* Footer con nombre y flecha */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between">
                    <div>
                        <p
                            className="text-white text-[22px] font-black leading-none"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                            {genre}
                        </p>
                        <p className="text-white/70 text-[11px] mt-0.5">
                            Explora {albumCount}+ álbumes
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#E8602A] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                            <path d="M2 6 L10 6 M6 2 L10 6 L6 10" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}