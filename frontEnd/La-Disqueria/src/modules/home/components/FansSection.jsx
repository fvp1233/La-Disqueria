import { Button } from "@/global/components/button";
import { Link } from "react-router-dom";

export function FansSection() {
  return (
    <section className="w-full bg-[#f6f7f1] flex flex-col md:flex-row items-stretch min-h-[520px]">
      
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-16 py-12 md:py-20 gap-6">
        <h2
          className="uppercase leading-[0.92] text-[#1a1a1a]"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(48px, 7vw, 96px)",
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
          <Button className="w-fit mt-4 bg-[#1a1a1a] text-white hover:bg-[#333] rounded-none px-10 py-5 text-sm font-semibold tracking-wide uppercase">
            Regístrate
          </Button>
        </Link>
      </div>

      <div className="w-full md:w-1/2 min-h-[300px] md:min-h-full relative overflow-hidden">
        <img
          src="/src/assets/tocadiscosFans.png"
          alt="Tocadiscos ilustrado"
          className="w-full h-full object-cover object-center"
        />
      </div>

    </section>
  );
}