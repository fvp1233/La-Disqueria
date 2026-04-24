import backgroundCta from "@/assets/backgroundCta.png";

export function CtaSection() {
  return (
    <section
      className="relative w-full bg-[#f6f7f1] overflow-hidden flex flex-col-reverse md:flex-row items-center justify-end"
      style={{ minHeight: "372px" }}
    >
      <img
        src={backgroundCta}
        alt=""
        className="w-full self-end md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 object-contain object-bottom"
        style={{ maxWidth: "934px", height: "auto", maxHeight: "372px" }}
      />

      <div className="
        relative z-10
        flex flex-col gap-3
        w-full md:w-auto
        px-6 py-6 md:py-0 md:mr-20
        items-center md:items-end
      ">
        {[
          "Lanzamientos exclusivos",
          "Lo más reciente",
          "Ofertas que no te puedes perder",
        ].map((label) => (
          <button
            key={label}
            className="w-full md:w-[300px] bg-[#4a6b6b] hover:bg-[#3a5555] text-white text-[11px] font-medium tracking-[2px] uppercase py-4 px-8 transition-colors duration-200"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}