import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArtistsHero } from "@/modules/artist/components/ArtistsHero";
import { ArtistsSearchBar } from "@/modules/artist/components/ArtistsSearchBar";
import { ArtistsGrid } from "@/modules/artist/components/ArtistsGrid";
import { ArtistsDiscoverBanner } from "@/modules/artist/components/ArtistsDiscoverBanner";
import { Footer } from "@/global/components/Footer";
import { Pagination } from "@/global/components/Pagination";
import useArtistsPage from "@/modules/artist/hooks/useArtistsPage";

const PAGE_SIZE = 12;

function ArtistsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Math.max(1, parseInt(searchParams.get("page")) || 1);

    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("Todos los géneros");

    // La página vive en la URL para sobrevivir a un refresh o a compartir el link.
    // Si cambia el filtro, se vuelve a la página 1 (se limpia el param).
    const filterKey = `${search}|${genre}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
    const filtersChanged = filterKey !== prevFilterKey;

    if (filtersChanged) {
        setPrevFilterKey(filterKey);
        if (searchParams.has("page")) {
            const next = new URLSearchParams(searchParams);
            next.delete("page");
            setSearchParams(next, { replace: true });
        }
    }

    const page = filtersChanged ? 1 : pageParam;

    const setPage = (newPage) => {
        const next = new URLSearchParams(searchParams);
        if (newPage <= 1) next.delete("page");
        else next.set("page", String(newPage));
        setSearchParams(next);
    };

    const { artists, total, totalPages, loading, error } = useArtistsPage({
        page,
        limit: PAGE_SIZE,
        search,
        genre,
    });

    return (
        <>
            <ArtistsHero />
            <ArtistsSearchBar
                onSearch={setSearch}
                onGenreChange={setGenre}
                totalArtists={total}
            />
            {error && <p className="text-center text-red-500 text-sm py-4">{error}</p>}
            {loading ? (
                <p className="text-center text-gray-400 py-16">Cargando artistas...</p>
            ) : (
                <>
                    <ArtistsGrid artists={artists} />
                    <div className="bg-white pb-10">
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                </>
            )}
            <ArtistsDiscoverBanner />
            <Footer />
        </>
    );
}

export default ArtistsPage;
