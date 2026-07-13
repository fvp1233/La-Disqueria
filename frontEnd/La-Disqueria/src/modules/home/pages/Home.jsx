import React from 'react';
import { HomeCarousel } from '../components/HomeCarousel'
import { Button } from '@/global/components/button';
import { Link } from "react-router-dom";
import { VinylCard } from '../components/VinylCard';
import useCatalog from '@/modules/products/hooks/useCatalog';
import useBestSellers from '../hooks/useBestSellers';
import banner1 from '@/assets/bannerfondo1.png'
import { CategoryFavorite } from '../components/CategoryFavorite';
import { MusicPlayer } from '../components/MusicPlayer';
import { FansSection } from '../components/FansSection';
import { CtaSection } from "../components/CtaSection";
import { Footer } from "../../../global/components/Footer";
import { BestSellersCarousel } from '../components/BestSellersCarousel';
import { Albums } from '../components/Albums';

const Home = () => {
    const { catalog, loading, error } = useCatalog();
    const { bestSellers } = useBestSellers(catalog);

    const availableDiscos = catalog.filter((disco) => disco.isAvailable);

    const featuredDiscos = [...availableDiscos]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 8);

    return (
        <>

            <HomeCarousel />
            <section className="w-full mx-auto px-4 md:px-18 mt-16">

                <div className="flex flex-col items-center text-center gap-6 border-b border-slate-200 pb-10 mb-10">

                    <div>
                        <h2 className="text-sm md:text-3xl font-light uppercase  text-slate-900 leading-[0.85]">
                            Discos para  entrega inmediata
                        </h2>
                    </div>

                    <Button
                        asChild
                        className="rounded-full px-10 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs tracking-[0.2em] transition-transform hover:scale-105"
                    >
                        <Link to="/products">STOCK</Link>
                    </Button>

                </div>

                <div>
                    <h2 className="text-sm md:text-lg font-bold text-slate-900 leading-[0.85] ml-15 mb-5">
                        Nuevos Lanzamientos
                    </h2>
                </div>

                {/* Grid de productos */}
                {error && <p className="text-center text-red-500 text-sm mb-6">{error}</p>}

                {loading ? (
                    <p className="text-center text-slate-400 text-sm py-10">Cargando catálogo...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {featuredDiscos.map((disco) => (
                            <VinylCard key={disco.id} product={disco} />
                        ))}
                    </div>
                )}

                <div className="flex justify-center mt-12 mb-20">
                    <Link to="/products" className="text-xs font-bold tracking-widest uppercase border-b border-black pb-1 hover:text-slate-500 hover:border-slate-500 transition-colors">
                        Ver todo el catálogo
                    </Link>
                </div>

            </section>

            <div>
                <img src={banner1} alt="banner" className='w-full h-auto object-cover max-h-100 mb-10' />
            </div>

            <BestSellersCarousel products={bestSellers} />

            <CategoryFavorite />

            <Albums />

            <MusicPlayer />
            <br />
                
            <section>
                <FansSection />
            </section>

            <section>
                <CtaSection />
            </section>
            
            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default Home;