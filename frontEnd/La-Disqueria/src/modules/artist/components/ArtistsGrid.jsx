import { ArtistCard } from "./ArtistCard";

export function ArtistsGrid({ artists = [] }) {
  return (
    <section className="px-30 py-10 bg-white">
      {artists.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No hay artistas que coincidan con tu búsqueda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-10">
          {artists.map((artist) => (
            <ArtistCard key={artist.slug || artist.name} artist={artist} />
          ))}
        </div>
      )}
    </section>
  );
}