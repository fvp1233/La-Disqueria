/**
 * AuthBrand
 * Logo de vinilo + nombre "La disqueria" + subtítulo de la acción actual.
 */
export function AuthBrand({ subtitle }) {
  return (
    <div className="flex flex-col items-center mb-6">
      {/* Vinilo SVG */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg"
        style={{
          background:
            "conic-gradient(from 0deg, #0a0a0a 0%, #1c1c1c 5%, #0a0a0a 10%, #1c1c1c 15%, #0a0a0a 20%, #1c1c1c 25%, #0a0a0a 30%, #1c1c1c 35%, #0a0a0a 40%, #1c1c1c 45%, #0a0a0a 50%, #1c1c1c 55%, #0a0a0a 60%, #1c1c1c 65%, #0a0a0a 70%, #1c1c1c 75%, #0a0a0a 80%, #1c1c1c 85%, #0a0a0a 90%, #1c1c1c 95%, #0a0a0a 100%)",
        }}
      >
        {/* Centro rosa con texto */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#F47E6A" }}
        >
          <span
            className="text-white font-black uppercase text-[5px] text-center leading-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            LA<br />DIS
          </span>
        </div>
      </div>

      {/* Nombre */}
      <h1
        className="text-[32px] font-black"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          color: "#E8602A",
        }}
      >
        La disqueria
      </h1>

      {/* Subtítulo / acción */}
      {subtitle && (
        <p className="text-[10px] font-semibold tracking-[3px] uppercase text-[#888] mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}