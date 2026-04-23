import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/global/components/carousel";
import { VinylCard } from "./VinylCard";

export function BestSellersCarousel({ vinyls }) {
    console.log("Datos de arousel", vinyls)
    return (
        <section className="w-full mx-auto px-4 md:px-18 py-12">
            <h2 className="text-sm md:text-lg font-bold text-slate-900 leading-[0.85] ml-15">Más Vendidos</h2>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {vinyls?.map((vinyl) => (
                        <CarouselItem
                            key={vinyl.id}
                            className="pl-6 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                            <div className="p-1">
                                {/* Aquí renderizan las tarjetas existentes */}
                                <VinylCard product={vinyl} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Botones de navegación */}
                <div className="hidden md:block">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>
        </section>
    );
}