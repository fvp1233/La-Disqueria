import { useEffect } from "react";
import { Footer } from "@/global/components/Footer";

export function Contact() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* CONTENIDO */}
      <main className="grow flex flex-col justify-center md:justify-start">

        {/* HERO */}
        <div className="w-full bg-[#F2C4BC] py-10 md:py-12 px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-light text-[#1a1a1a] mb-3">
            Hablemos de música
          </h1>
          <p className="text-sm text-[#5a5a5a] max-w-sm mx-auto leading-relaxed">
            ¿Buscas algo en específico o tienes dudas sobre tu pedido? Estamos
            aquí para ayudarte a encontrar el sonido perfecto.
          </p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center md:items-start">

          {/* INFO */}
          <div className="flex flex-col gap-6 md:gap-7">
            <div>
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-2">Visítanos</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                Calle de la Armonía 123<br />
                Colonia Melodía, Ciudad de México<br />
                <span className="text-[#888]">Lunes a Sábado: 11:00 – 20:00</span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-2">Directo</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                hola@ladisqueria.com<br />
                +52 (55) 1234 5678
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-2">Síguenos</h3>
              <div className="flex gap-2 text-sm text-[#E8602A]">
                <span className="cursor-pointer hover:underline">Instagram</span>
                <span className="text-[#ccc]">/</span>
                <span className="cursor-pointer hover:underline">Facebook</span>
                <span className="text-[#ccc]">/</span>
                <span className="cursor-pointer hover:underline">Spotify</span>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#999]">Nombre Completo</label>
              <input
                type="text"
                placeholder="John Doe"
                className="border border-[#ddd] rounded px-3.5 py-2.5 text-sm outline-none focus:border-[#E8602A] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#999]">Correo Electrónico</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="border border-[#ddd] rounded px-3.5 py-2.5 text-sm outline-none focus:border-[#E8602A] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#999]">Tu Mensaje</label>
              <textarea
                placeholder="¿En qué podemos ayudarte?"
                rows={5}
                className="border border-[#ddd] rounded px-3.5 py-2.5 text-sm outline-none focus:border-[#E8602A] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E8602A] hover:bg-[#c94e1e] text-white text-sm font-medium py-3.5 rounded transition-colors duration-200"
            >
              Enviar Mensaje
            </button>
          </form>

        </div>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}