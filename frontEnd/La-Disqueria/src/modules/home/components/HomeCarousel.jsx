import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/global/components/carousel";
import Autoplay from "embla-carousel-autoplay" //Para que se mueva solito
import nuevosIngresoSImg from '@/assets/Nuevos_ingresoS.jpg'

//Lo que lleva el banner

const bannerItems = [
    { id: 1, img: nuevosIngresoSImg, alt: "Foto 1" },
    { id: 2, img: nuevosIngresoSImg, alt: "Foto 2" },
    { id: 3, img: nuevosIngresoSImg, alt: "Foto 3" },
];

export function HomeCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )

    return (
  <section className="relative w-full overflow-hidden leading-[0]">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="ml-0">
                    {bannerItems.map((item) => (
                        <CarouselItem key={item.id} className="pl-0">
                            <div className="w-full leading-0">
                                <img
                                    src={item.img}
                                    alt={item.alt}
                                    className="w-full h-auto select-none block object-cover object-bottom"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Flechas minimalistas */}
                <CarouselPrevious className="left-4 lg:left-10 border-none bg-transparent hover:bg-transparent text-slate-800 scale-150 shadow-none invisible md:visible" />
                <CarouselNext className="right-4 lg:right-10 border-none bg-transparent hover:bg-transparent text-slate-800 scale-150 shadow-none invisible md:visible" />
            </Carousel>

            
        </section>
    )

}