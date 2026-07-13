import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { VinylCard } from '@/modules/home/components/VinylCard';
import useProducts from '@/modules/products/hooks/useProducts';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/global/components/dropdown-menu";
import { Button } from "@/global/components/button";
import { Pagination } from "@/global/components/Pagination";

const TYPE_LABELS = {
    vinyl: 'Vinilos',
    cd: 'CDs',
    turntable: 'Tocadiscos',
    accessory: 'Accesorios',
};

const PAGE_SIZE = 12;

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Filtros que llegan desde el menú desplegable (Productos / Artistas / Categorías)
    const genreParam = searchParams.get('genre') || '';
    const typeParam = searchParams.get('type') || '';
    const artistParam = searchParams.get('artist') || '';
    const artistNameParam = searchParams.get('artistName') || '';

    //Aqui se define la disponibilidad all, in-stock o out-of-stock
    const [filterStock, setFilterStock] = useState('all');
    //Se define el orden alfabetico, menor precio o mayor precio
    const [sortOrder, setSortOrder] = useState('az');

    // La página vive en la URL (junto a los demás filtros) para que se
    // mantenga al refrescar, compartir el link o navegar con atrás/adelante.
    const pageParam = Math.max(1, parseInt(searchParams.get('page')) || 1);

    // Cualquier cambio de filtro u orden vuelve a la primera página
    const filterKey = `${genreParam}|${typeParam}|${artistParam}|${filterStock}|${sortOrder}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
    const filtersChanged = filterKey !== prevFilterKey;

    if (filtersChanged) {
        setPrevFilterKey(filterKey);
        if (searchParams.has('page')) {
            const next = new URLSearchParams(searchParams);
            next.delete('page');
            setSearchParams(next, { replace: true });
        }
    }

    const page = filtersChanged ? 1 : pageParam;

    const setPage = (newPage) => {
        const next = new URLSearchParams(searchParams);
        if (newPage <= 1) next.delete('page');
        else next.set('page', String(newPage));
        setSearchParams(next);
    };

    const isAvailableParam =
        filterStock === 'in-stock' ? 'true' : filterStock === 'out-of-stock' ? 'false' : undefined;

    const { products, total, totalPages, loading, error } = useProducts({
        page,
        limit: PAGE_SIZE,
        type: typeParam || undefined,
        genre: genreParam || undefined,
        artistId: artistParam || undefined,
        isAvailable: isAvailableParam,
        sort: sortOrder,
    });

    const removeParam = (key) => {
        const next = new URLSearchParams(searchParams);
        next.delete(key);
        if (key === 'artist') next.delete('artistName');
        setSearchParams(next);
    };

    const clearAllFilters = () => {
        setFilterStock('all');
        setSortOrder('az');
        setSearchParams({});
    };

    const getSortLabel = () => {
        if (sortOrder === 'az') return 'Alfabéticamente, A-Z';
        if (sortOrder === 'za') return 'Alfabéticamente, Z-A';
        if (sortOrder === 'price-low') return 'Precio: Menor a Mayor';
        if (sortOrder === 'price-high') return 'Precio: Mayor a Menor';
        return 'Alfabéticamente, A-Z';
    };

    const triggerStyles = "flex items-center gap-2 h-8 px-0 bg-transparent border-none cursor-pointer font-medium text-slate-900 text-sm hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-transparent data-[state=open]:text-slate-900 active:bg-transparent active:text-slate-900 outline-none";
    const itemStyles = "text-xs uppercase tracking-tight data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 cursor-pointer";

    const hasUrlFilters = Boolean(genreParam || typeParam || artistParam);

    return (
        <main className="w-full bg-[#f9f8f3] min-h-screen pb-20">
            <header className="max-w-[90%] lg:max-w-[85%] mx-auto px-4 pt-16 pb-12">
                <h1 className="text-4xl md:text-5xl font-medium text-slate-900 mb-8 tracking-tight">
                    Productos
                </h1>
                <p className="max-w-4xl text-slate-700 leading-relaxed text-sm md:text-base">
                    Explora toda nuestra exclusiva colección de vinilos y CDs en La Disquería,
                    la tienda en línea líder en El Salvador. Desde ediciones limitadas hasta clásicos atemporales.
                </p>

                {hasUrlFilters && (
                    <div className="flex flex-wrap items-center gap-2 mt-6">
                        <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Filtrando por:</span>

                        {typeParam && (
                            <button
                                onClick={() => removeParam('type')}
                                className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
                            >
                                {TYPE_LABELS[typeParam] || typeParam} <X className="h-3 w-3" />
                            </button>
                        )}

                        {genreParam && (
                            <button
                                onClick={() => removeParam('genre')}
                                className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
                            >
                                {genreParam} <X className="h-3 w-3" />
                            </button>
                        )}

                        {artistParam && (
                            <button
                                onClick={() => removeParam('artist')}
                                className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
                            >
                                {artistNameParam || 'Artista'} <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                )}
            </header>

            <section className="max-w-[90%] lg:max-w-[85%] mx-auto px-4 mb-12 flex flex-wrap items-center justify-between gap-6 border-t border-slate-200 pt-8">

                {/* Filtro Disponibilidad */}
                <div className="flex items-center gap-4">
                    <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Filtrar:</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger className={triggerStyles}>
                            Disponibilidad <ChevronDown className="h-4 w-4 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white border-slate-200 w-48">
                            <DropdownMenuItem onClick={() => setFilterStock('all')} className={itemStyles}>Todos</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStock('in-stock')} className={itemStyles}>En Stock</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStock('out-of-stock')} className={itemStyles}>Agotados</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Orden y Conteo */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Ordenar por:</span>

                        <DropdownMenu>
                            <DropdownMenuTrigger className={triggerStyles}>
                                {getSortLabel()} <ChevronDown className="h-4 w-4 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-slate-200 w-56">
                                <DropdownMenuItem onClick={() => setSortOrder('az')} className={itemStyles}>Alfabéticamente, A-Z</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder('za')} className={itemStyles}>Alfabéticamente, Z-A</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem onClick={() => setSortOrder('price-low')} className={itemStyles}>Precio: Menor a Mayor</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder('price-high')} className={itemStyles}>Precio: Mayor a Menor</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <span className="text-slate-400 font-light text-sm italic">
                        {total} producto{total === 1 ? '' : 's'}
                    </span>
                </div>
            </section>

            {/* Grid de Productos */}
            <section className="max-w-[90%] lg:max-w-[85%] mx-auto px-4">
                {error && <p className="text-center text-red-500 text-sm mb-8">{error}</p>}

                {loading ? (
                    <p className="text-center text-slate-400 font-light py-32">Cargando productos...</p>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                            {products.map((disco) => (
                                <VinylCard key={disco.id} product={disco} />
                            ))}
                        </div>

                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                ) : (
                    <div className="py-32 text-center border-y border-dashed border-slate-200">
                        <p className="text-slate-400 font-light">No hay productos que coincidan con tu selección.</p>
                        <Button
                            variant="link"
                            onClick={clearAllFilters}
                            className="mt-2 text-xs uppercase tracking-widest text-slate-900"
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Products;
