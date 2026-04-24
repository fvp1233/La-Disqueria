import { ArtistCard } from "./ArtistCard";

export const MOCK_ARTISTS = [
  { name: "The Beatles", genres: ["Pop", "Rock"], slug: "the-beatles" , image: "https://i.pinimg.com/736x/82/4c/8f/824c8f2702fd3e2e2fdaf5547e5ff2a3.jpg"},
  { name: "Radiohead", genres: ["Rock Alternativo"], slug: "radiohead" , image: "https://i.pinimg.com/736x/61/97/64/6197649ddfc10a67324cad4c148f9295.jpg"},
  { name: "Amy Winehouse", genres: ["Soul", "Jazz"], slug: "amy-winehouse", image: "https://i.pinimg.com/736x/a2/43/c7/a243c71afcee9a6cc4a769b44632a300.jpg" },
  { name: "Kendrick Lamar", genres: ["Hip Hop", "Rap"], slug: "kendrick-lamar", image: "https://i.pinimg.com/736x/70/24/8a/70248a4ed5770c4621bc6fcdb52ace08.jpg" },
  { name: "Pink Floyd", genres: ["Rock Progresivo"], slug: "pink-floyd" , image: "https://i.pinimg.com/736x/26/84/5f/26845fc541e4fb4a3fa34a48b87ddbd0.jpg"},
  { name: "Daft Punk", genres: ["Electrónica", "Dance"], slug: "daft-punk" , image: "https://i.pinimg.com/1200x/91/52/b2/9152b2dc174934279cda4509b0931434.jpg"},
  { name: "Billie Eilish", genres: ["Pop", "Alternativo"], slug: "billie-eilish" , image: "https://i.pinimg.com/736x/9c/d9/73/9cd9731f8b0dd6c8f974b046539b5d98.jpg"},
  { name: "Miles Davis", genres: ["Jazz"], slug: "miles-davis" , image: "https://i.pinimg.com/1200x/5b/cf/18/5bcf18f3f6b35e346ee1db69359ebe05.jpg"},
  { name: "Nirvana", genres: ["Grunge", "Rock"], slug: "nirvana", image: "https://i.pinimg.com/736x/53/65/26/5365268cb5b0b4b6d4e123eb7e24dfff.jpg" },
  { name: "The Rolling Stones", genres: ["Rock"], slug: "the-rolling-stones" , image: "https://i.pinimg.com/1200x/73/ac/42/73ac42468143a98281dd9f6e63ea9fdc.jpg"},
  { name: "Arctic Monkeys", genres: ["Indie Rock"], slug: "arctic-monkeys" , image: "https://i.pinimg.com/736x/8e/a9/cf/8ea9cfea318c33711a51196d76b57cf6.jpg"},
  { name: "Madvillain", genres: ["Hip Hop"], slug: "madvillain" , image: "https://i.pinimg.com/1200x/df/b1/38/dfb138410c1415282dd79aca8d5a5e22.jpg"},
];

export function ArtistsGrid({ artists = MOCK_ARTISTS }) {
  return (
    <section className="px-30 py-10 bg-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-10">
        {artists.map((artist) => (
          <ArtistCard key={artist.slug || artist.name} artist={artist} />
        ))}
      </div>
    </section>
  );
}