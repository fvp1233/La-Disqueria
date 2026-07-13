import { useMemo, useState } from "react";
import RockHero from "@/modules/artist/components/RockHero";
import { ArtistsSearchBar } from "@/modules/artist/components/ArtistsSearchBar";
import { ArtistsGrid } from "@/modules/artist/components/ArtistsGrid";
import { Footer } from "@/global/components/Footer";
import useArtists from "@/modules/artist/hooks/useArtists";

function RockPage() {
    const { artists, loading, error } = useArtists();
    const [search, setSearch] = useState("");

    const rockArtists = useMemo(
        () => artists.filter((a) => a.genres.some((g) => g.toLowerCase().includes("rock"))),
        [artists]
    );

    const filteredArtists = useMemo(() => {
        if (!search.trim()) return rockArtists;
        return rockArtists.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()))
        );
    }, [rockArtists, search]);

    return (
        <>
            <RockHero />
            <ArtistsSearchBar
                onSearch={setSearch}
                totalArtists={rockArtists.length}
            />
            {error && <p className="text-center text-red-500 text-sm py-4">{error}</p>}
            {loading ? (
                <p className="text-center text-gray-400 py-16">Cargando artistas...</p>
            ) : (
                <ArtistsGrid artists={filteredArtists} />
            )}
            <Footer />
        </>
    );
}

export default RockPage;
