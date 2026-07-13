import { Link } from "react-router-dom";
import { CategoryCard } from "./CategoryCard";
import useCategories from "@/modules/categories/hooks/useCategories";

export function CategoriesGrid() {
  const { categories, loading, error } = useCategories();

  return (
    <section className="px-12 py-12 bg-[#f8f8f8]">
      {/* Título sección */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2
            className="text-[26px] font-black uppercase text-[#1a1a1a]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            EXPLORA POR GÉNEROS
          </h2>
          <div className="w-10 h-[3px] bg-[#E8602A] mt-1" />
        </div>
        <p className="text-[11px] text-[#888]">
          Encuentra tu sonido favorito entre nuestras categorías.
        </p>
      </div>

      {error && <p className="text-center text-red-500 text-sm mb-6">{error}</p>}

      {/* Grid de categorías 3x2 */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">Cargando categorías...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} genre={cat.name} albumCount={cat.albumCount} slug={cat.slug} />
          ))}
        </div>
      )}

      {/* Botón ver todas */}
      <div className="flex justify-center mt-10">
        <Link
          to="/categorias"
          className="inline-block border border-[#1a1a1a] text-[#1a1a1a] text-[11px] font-semibold uppercase tracking-widest px-10 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          VER TODAS LAS CATEGORÍAS
        </Link>
      </div>
    </section>
  );
}