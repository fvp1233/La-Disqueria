import heroBanner from "@/assets/Rock.png";

/**
 * RockHero
 * Simplemente renderiza la imagen del banner ya diseñada.
 * Reemplaza "@/assets/rock-hero-banner.png" con la ruta real de tu imagen.
 */
function RockHero() {
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

export default RockHero;