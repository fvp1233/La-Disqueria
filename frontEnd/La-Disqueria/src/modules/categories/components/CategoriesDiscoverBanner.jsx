import { Link } from "react-router-dom";
import discoverBannerImg from "@/assets/bannerfondo1.png";


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

      {/* Imagen derecha */}
      <div className="overflow-hidden">
        <img
          src={discoverBannerImg}
          alt="Descubre nuevas sonoridades"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}