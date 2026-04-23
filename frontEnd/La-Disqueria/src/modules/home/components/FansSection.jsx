import { Button } from "@/global/components/button";
import {Link} from "react-router-dom";
export function FansHeroSection() {
    return (
        <section className="w-full bg-[#f6f7f1] min-h-[520px] flex items-stretch">
            {/* Lado izquierdo — Texto + CTA */}
            <div className="flex flex-col justify-center w-1/2 px-16 py-20 gap-6">
                <h2
                    className="uppercase leading-[0.92] text-[#1a1a1a]"
                    style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: "clamp(60px, 7vw, 96px)", // responsive automático
                        fontWeight: 800,
                        letterSpacing: "-1px",
                    }}
                >
                    DE FANS <br /> PARA FANS
                </h2>

                <p className="text-sm text-[#3a3a3a] leading-relaxed max-w-xs">
                    Nosotros entendemos que no hay mejor sentimiento que el escuchar tu
                    música favorita, por eso desde 2026 te acompañamos a tener una
                    experiencia de tenerla junto a ti.
                </p>

                <Link to="/contact">
                <Button
                    asChild
                    className="w-fit mt-4 bg-[#1a1a1a] text-white hover:bg-[#333] rounded-none px-10 py-5 text-sm font-semibold tracking-wide uppercase"
                >
                    Regístrate
                </Button>
                </Link>
                </div>

            <div className="w-1/2 relative overflow-hidden">
                <img
                    src="/src/assets/tocadiscosFans.png"
                    alt="Tocadiscos ilustrado"
                    className="w-full h-full object-cover object-center"
                />
            </div>
        </section>
    );
}