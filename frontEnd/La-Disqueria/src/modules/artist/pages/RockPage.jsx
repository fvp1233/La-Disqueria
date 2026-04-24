import { useState } from "react";
import RockHero  from "@/modules/artist/components/RockHero";
import { ArtistsSearchBar } from "@/modules/artist/components/ArtistsSearchBar";
import { ArtistsGrid, MOCK_ARTISTS } from "@/modules/artist/components/ArtistsGrid";
import { Footer } from "@/global/components/Footer";

function RockPage() {
    const [filteredArtists, setFilteredArtists] = useState(MOCK_ARTISTS);

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredArtists(MOCK_ARTISTS);
            return;
        }
        setFilteredArtists(
            MOCK_ARTISTS.filter((a) =>
                a.name.toLowerCase().includes(query.toLowerCase()) ||
                a.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
            )
        );
    };

    const handleGenreChange = (genre) => {
        if (genre === "Rcok") {
            setFilteredArtists(MOCK_ARTISTS);
            return;
        }
        setFilteredArtists(
            MOCK_ARTISTS.filter((a) =>
                a.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase()))
            )
        );
    };

    return (
        <>
            <RockHero/>
            <ArtistsSearchBar
                onSearch={handleSearch}
                onGenreChange={handleGenreChange}
                totalArtists={1200}
            />
            <ArtistsGrid artists={filteredArtists} />
            <Footer />
        </>
    );
}

export default RockPage;