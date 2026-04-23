import backgroundCta from "@/assets/backgroundCta.png";

export function CtaSection() {
  return (
    <section className="relative w-full bg-[#f6f7f1] overflow-hidden flex items-center"
      style={{ minHeight: "372px" }}
    >
      {/* Imagen centrada, tamaño natural, pegada al fondo */}
      <img
        src={backgroundCta}
        alt=""
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "934px", height: "372px", objectFit: "contain" }}
      />

      {/* Botones derecha — encima de la imagen */}
      <div className="relative z-10 ml-auto mr-20 flex flex-col gap-4">
        {[
          "Lanzamientos exclusivos",
          "Lo más reciente",
          "Ofertas que no te puedes perder",
        ].map((label) => (
          <button
            key={label}
            className="w-[300px] bg-[#4a6b6b] hover:bg-[#3a5555] text-white text-[11px] font-medium tracking-[2px] uppercase py-4 px-8 transition-colors duration-200"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}