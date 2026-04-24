import { Link } from "react-router-dom";

export function CategoriesDiscoverBanner() {
  return (
    <section className="mx-12 my-10 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[200px]">
      {/* Texto izquierdo */}
      <div className="bg-[#F47E6A] p-10 flex flex-col justify-center">
        <h2
          className="text-[28px] font-black uppercase text-white leading-tight mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          DESCUBRE NUEVAS<br />SONORIDADES
        </h2>
        <p className="text-[12px] text-white/85 mb-6 leading-relaxed max-w-[220px]">
          Navega entre nuestras categorías y encuentra álbumes, artistas y ediciones especiales.
        </p>
        <Link
          to="/productos"
          className="inline-block bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-black transition-colors self-start"
        >
          EXPLORAR AHORA
        </Link>
      </div>

      {/* Imagen derecha - vinilos de colores */}
      <div className="bg-[#e8d5c0] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Vinilos decorativos de colores */}
        {[
          { color: "#c41e3a", x: "10%", y: "20%", size: 80 },
          { color: "#2d2d2d", x: "35%", y: "5%", size: 70 },
          { color: "#F47E6A", x: "60%", y: "15%", size: 90 },
          { color: "#f5c842", x: "80%", y: "30%", size: 65 },
          { color: "#2d2d2d", x: "20%", y: "55%", size: 75 },
          { color: "#4a8c6a", x: "50%", y: "55%", size: 85 },
          { color: "#2d2d2d", x: "75%", y: "60%", size: 70 },
        ].map(({ color, x, y, size }, i) => (
          <div
            key={i}
            className="absolute rounded-full flex items-center justify-center"
            style={{
              left: x,
              top: y,
              width: size,
              height: size,
              background: `conic-gradient(from 0deg, ${color} 0%, ${color}cc 5%, ${color} 10%, ${color}cc 15%, ${color} 20%, ${color}cc 25%, ${color} 30%, ${color}cc 35%, ${color} 40%, ${color}cc 45%, ${color} 50%, ${color}cc 55%, ${color} 60%, ${color}cc 65%, ${color} 70%, ${color}cc 75%, ${color} 80%, ${color}cc 85%, ${color} 90%, ${color}cc 95%, ${color} 100%)`,
            }}
          >
            <div className="w-[28%] h-[28%] rounded-full bg-[#e8d5c0]" />
          </div>
        ))}
      </div>
    </section>
  );
}