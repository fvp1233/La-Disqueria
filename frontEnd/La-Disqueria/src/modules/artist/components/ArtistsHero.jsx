import heroBanner from "@/assets/Artistas2.png";

/**
 * ArtistsHero
 * Simplemente renderiza la imagen del banner ya diseñada.
 * Reemplaza "@/assets/artists-hero-banner.png" con la ruta real de tu imagen.
 */
export function ArtistsHero() {
  return (
    <section className="w-full">
      <img
        src={heroBanner}
        alt="Artistas — Explora, descubre y colecciona la música de tus artistas favoritos"
        className="w-full object-cover"
      />
    </section>
  );
}