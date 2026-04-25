import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { VinylCard } from '@/modules/home/components/VinylCard';
import { VINYLS_DATA } from '@/global/data/vinyls';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/global/components/dropdown-menu";
import { Button } from "@/global/components/button";

const Products = () => {
    //Aqui se define la disponibilidad all, in-stock o out-of-stock
    const [filterStock, setFilterStock] = useState('all');
    //Se define el orden alfabetico, menor precio o mayor precio
    const [sortOrder, setSortOrder] = useState('az');

    //Usamos useMemo para que los cálculos solo se repitan cuando cambian los filtros o los datos, evitando procesar la lista innecesariamente en cada renderizado
    // Solo se recalculará cuando el usuario cambie el stock o el orden
    const filteredProducts = useMemo(() => {
        //Creamos una copia de los datos originales
        let result = [...VINYLS_DATA];

        if (filterStock === 'in-stock') {
            //Solo deja los discos cuyo sotck es mayor a 0
            result = result.filter(disco => disco.stock > 0);
        } else if (filterStock === 'out-of-stock') {
            //Si no deja los que su stock sea 0
            result = result.filter(disco => disco.stock === 0);
        }

        result.sort((a, b) => {
            //Les asigno un valor por si los datos vienen vacios
            const albumA = a.album || "";
            const albumB = b.album || "";
            const priceA = a.price || 0;
            const priceB = b.price || 0;

            //Método de JS para comparar strings considerando tildes y orden alfabético Retorna -1 (va antes), 1 (va después) o 0 (igual)
            //(a - b) para orden ascendente (Si el resultado es negativo, 'a' es menor y va primero).
            //(b - a) para orden descendente (Si el resultado es positivo, 'b' es mayor y va primero).

            if (sortOrder === 'az') return albumA.localeCompare(albumB);
            if (sortOrder === 'za') return albumB.localeCompare(albumA);
            if (sortOrder === 'price-low') return priceA - priceB;
            if (sortOrder === 'price-high') return priceB - priceA;
            return 0;
        });

        return result;
    }, [filterStock, sortOrder]);

    const getSortLabel = () => {
        if (sortOrder === 'az') return 'Alfabéticamente, A-Z';
        if (sortOrder === 'za') return 'Alfabéticamente, Z-A';
        if (sortOrder === 'price-low') return 'Precio: Menor a Mayor';
        if (sortOrder === 'price-high') return 'Precio: Mayor a Menor';
        return 'Alfabéticamente, A-Z';
    };

    const triggerStyles = "flex items-center gap-2 h-8 px-0 bg-transparent border-none cursor-pointer font-medium text-slate-900 text-sm hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-transparent data-[state=open]:text-slate-900 active:bg-transparent active:text-slate-900 outline-none";
    const itemStyles = "text-xs uppercase tracking-tight data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 cursor-pointer";


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
                        {filteredProducts.length} productos
                    </span>
                </div>
            </section>

            {/* Grid de Productos */}
            <section className="max-w-[90%] lg:max-w-[85%] mx-auto px-4">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                        {filteredProducts.map((disco) => (
                            <VinylCard key={disco.id} product={disco} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border-y border-dashed border-slate-200">
                        <p className="text-slate-400 font-light">No hay vinilos que coincidan con tu selección.</p>
                        <Button
                            variant="link"
                            onClick={() => { setFilterStock('all'); setSortOrder('az'); }}
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