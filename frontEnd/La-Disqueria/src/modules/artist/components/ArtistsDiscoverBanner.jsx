import { Link } from "react-router-dom";

export function ArtistsDiscoverBanner() {
  return (
    <section
      className="relative w-full py-16 px-12 overflow-hidden"
      style={{
        background: "linear-gradient(rgba(255, 131, 131, 0.65), rgba(0,0,0,0.65)), url('/assets/record-store.jpg') center/cover no-repeat",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Fallback gradient si no hay imagen */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-sm">
        <h2
          className="text-[36px] font-black uppercase text-white leading-tight mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          DESCUBRE NUEVOS<br />ARTISTAS
        </h2>
        <p className="text-[13px] text-white/75 mb-6 leading-relaxed">
          Sé el primero en recibir recomendaciones personalizadas
          y encuentra tu próximo favorito.
        </p>
        <Link
          to="/artistas"
          className="inline-block bg-[#E8602A] text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-[#cf4e1e] transition-colors"
        >
          EXPLORAR AHORA
        </Link>
      </div>
    </section>
  );
}