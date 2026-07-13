import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { VinylCard } from '@/modules/home/components/VinylCard';
import useProducts from '@/modules/products/hooks/useProducts';
import useCategoryDetail from '@/modules/categories/hooks/useCategoryDetail';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/global/components/dropdown-menu";
import { Pagination } from "@/global/components/Pagination";

const PAGE_SIZE = 12;

export default function CategoryDetailPage() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { category, loading: loadingCategory, error: categoryError, notFound } = useCategoryDetail(slug);

    const [filterStock, setFilterStock] = useState('all');
    const [sortOrder, setSortOrder] = useState('az');

    // La página vive en la URL para que se mantenga al refrescar o compartir el link.
    const pageParam = Math.max(1, parseInt(searchParams.get('page')) || 1);

    // Cualquier cambio de categoría o filtro vuelve a la primera página
    const filterKey = `${slug}|${filterStock}|${sortOrder}`;
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

    const { products, total, totalPages, loading: loadingProducts, error: productsError } = useProducts({
        page,
        limit: PAGE_SIZE,
        genre: category?.name,
        isAvailable: isAvailableParam,
        sort: sortOrder,
    });

    const getSortLabel = () => {
        if (sortOrder === 'az') return 'Alfabéticamente, A-Z';
        if (sortOrder === 'za') return 'Alfabéticamente, Z-A';
        if (sortOrder === 'price-low') return 'Precio: Menor a Mayor';
        if (sortOrder === 'price-high') return 'Precio: Mayor a Menor';
        return 'Alfabéticamente, A-Z';
    };

    const triggerStyles = "flex items-center gap-2 h-8 px-0 bg-transparent border-none cursor-pointer font-medium text-slate-900 text-sm hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-transparent data-[state=open]:text-slate-900 active:bg-transparent active:text-slate-900 outline-none";
    const itemStyles = "text-xs uppercase tracking-tight data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 cursor-pointer";

    if (loadingCategory) {
        return <p className="text-center text-slate-400 font-light py-32">Cargando categoría...</p>;
    }

    if (categoryError || notFound) {
        return (
            <main className="w-full bg-[#f9f8f3] min-h-screen pb-20">
                <div className="max-w-[90%] lg:max-w-[85%] mx-auto px-4 pt-16 text-center">
                    <p className="text-slate-400 font-light py-16">
                        {categoryError || "No encontramos esta categoría."}
                    </p>
                    <Link to="/categorias" className="text-xs font-bold tracking-widest uppercase border-b border-black pb-1 hover:text-slate-500 hover:border-slate-500 transition-colors">
                        Ver todas las categorías
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full bg-[#f9f8f3] min-h-screen pb-20">
            <header className="max-w-[90%] lg:max-w-[85%] mx-auto px-4 pt-16 pb-12">
                <Link to="/categorias" className="text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 transition-colors">
                    ← Todas las categorías
                </Link>
                <h1 className="text-4xl md:text-5xl font-medium text-slate-900 mt-6 mb-4 tracking-tight">
                    {category.name}
                </h1>
                {category.description && (
                    <p className="max-w-4xl text-slate-700 leading-relaxed text-sm md:text-base">
                        {category.description}
                    </p>
                )}
                <p className="text-slate-400 text-sm mt-3">{category.albumCount} álbumes en esta categoría</p>
            </header>

            <section className="max-w-[90%] lg:max-w-[85%] mx-auto px-4 mb-12 flex flex-wrap items-center justify-between gap-6 border-t border-slate-200 pt-8">
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

            <section className="max-w-[90%] lg:max-w-[85%] mx-auto px-4">
                {productsError && <p className="text-center text-red-500 text-sm mb-8">{productsError}</p>}

                {loadingProducts ? (
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
                        <p className="text-slate-400 font-light">Todavía no hay productos en esta categoría.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
