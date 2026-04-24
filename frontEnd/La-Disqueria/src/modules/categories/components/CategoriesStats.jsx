const STATS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" stroke="white" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1" fill="white" />
      </svg>
    ),
    value: "30+",
    label: "GÉNEROS MUSICALES",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 14 L4 8 L10 5 L10 11" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="7" cy="14.5" r="2.5" stroke="white" strokeWidth="1.5" />
        <circle cx="13" cy="11.5" r="2.5" stroke="white" strokeWidth="1.5" />
        <path d="M10 11 L16 8 L16 14" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    value: "1000+",
    label: "ÁLBUMES DISPONIBLES",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <polygon points="10,3 12.5,8 18,8.5 14,12.5 15.5,18 10,15 4.5,18 6,12.5 2,8.5 7.5,8" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    value: "NUEVO",
    label: "CONTENIDO SEMANAL",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10 C3 6.5 6.5 3 10 3 C13.5 3 17 6.5 17 10" stroke="white" strokeWidth="1.5" fill="none" />
        <rect x="2" y="10" width="3" height="5" rx="1.5" fill="white" />
        <rect x="15" y="10" width="3" height="5" rx="1.5" fill="white" />
      </svg>
    ),
    value: "PARA TODOS",
    label: "LOS GUSTOS",
  },
];

export function CategoriesStats() {
  return (
    <section className="px-12 py-8 bg-white border-b border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ icon, value, label }) => (
          <div key={label} className="flex items-center gap-4">
            {/* Icono circular naranja */}
            <div className="w-12 h-12 rounded-full bg-[#E8602A] flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            {/* Texto */}
            <div>
              <p className="text-[18px] font-black text-[#1a1a1a] leading-none">
                {value}
              </p>
              <p className="text-[9px] font-semibold tracking-widest text-[#888] uppercase mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}