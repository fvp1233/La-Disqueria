import heroBanner from "@/assets/Categorias.png";

/**
 * CategoriesHero
 * Simplemente renderiza la imagen del banner ya diseñada.
 * Reemplaza "@/assets/categories-hero-banner.png" con la ruta real de tu imagen.
 */
export function CategoriesHero() {
  return (
    <section className="w-full">
      <img
        src={heroBanner}
        alt="Categorías — Explora por géneros y encuentra la música perfecta para cada momento"
        className="w-full object-cover"
      />
    </section>
  );
}