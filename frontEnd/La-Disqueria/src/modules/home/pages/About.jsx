import discoImg from "@/assets/discoBlackAndWhite.png";
import { Footer } from "@/global/components/Footer";
import iconPush from "@/assets/PushSvg.png";
import iconBuy from "@/assets/ShopSvg.png";
import iconCheck from "../../../assets/CheckSvg.png";

const teamMembers = [
  { name: "Fernando Miguel", lastName: "Velásquez", role: "Dev" },
  { name: "Gabriela Isabel", lastName: "Castillo", role: "Dev" },
  { name: "Freddy Ricardo", lastName: "Pérez", role: "Dev" },
  { name: "Daniela Elizabeth", lastName: "Villalta", role: "Dev" },
  { name: "Natalie Abigail", lastName: "Navarro", role: "Dev" },
];

export function About() {
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-12 py-10 md:py-14 bg-white items-center">
        <div>
          <span className="text-[9px] font-semibold tracking-[3px] text-[#E8602A] uppercase border border-[#E8602A] px-2.5 py-1 inline-block mb-5">
            Est. 2026 · El Salvador
          </span>
          <h1
            className="font-black leading-[1] uppercase text-[#0f172a] mb-5"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(36px, 6vw, 52px)",
            }}
          >
            La música<br />no se<br />escucha,{" "}
            <span className="text-[#E8602A]">se<br />siente.</span>
          </h1>
          <p className="text-xs text-[#666] leading-relaxed max-w-[280px] mb-6">
            Conectando a los amantes de la música en El Salvador con experiencias
            sonoras auténticas a través de una plataforma moderna y cooperativa.
          </p>
          <div className="flex gap-8">
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-[#E8602A] uppercase mb-1">MERN Stack</p>
              <p className="text-xs text-[#333] font-bold">Tecnología moderna V.5</p>
            </div>
            <div>
              <p className="text-[9px] font-semibold tracking-widest text-[#E8602A] uppercase mb-1">Cooperativa</p>
              <p className="text-xs text-[#333] font-bold">Garaje model</p>
            </div>
          </div>
        </div>

        <div className="relative p-4 max-w-[320px] mx-auto w-full">
          <div className="absolute inset-0 bg-[#F2C4BC] rounded-lg translate-x-3 translate-y-3" />
          <div className="relative w-full aspect-square overflow-hidden rounded border border-white/20">
            <img
              src={discoImg}
              alt="Disco de vinilo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -left-3 w-11 h-11 rounded-lg bg-[#E8602A] flex items-center justify-center z-10 shadow-md">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="white">
              <rect x="1" y="4" width="2" height="8" rx="1" />
              <rect x="5" y="2" width="2" height="12" rx="1" />
              <rect x="9" y="5" width="2" height="6" rx="1" />
              <rect x="13" y="3" width="2" height="10" rx="1" />
            </svg>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-12 py-10 md:py-14 bg-[#fafafa]">
        <div className="border-l-[3px] border-[#E8602A] pl-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#E8602A" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="2.5" stroke="#E8602A" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="0.8" fill="#E8602A"/>
            </svg>
            <p className="text-sm font-bold tracking-[2px] text-[#E8602A] uppercase">Nuestra Misión</p>
          </div>
          <p className="text-sm font-medium text-[#334155] leading-relaxed">
            Conectar a los entusiastas de la música con el sonido puro del vinilo
            en El Salvador, fomentando una comunidad que valora la tangibilidad y
            la calidad acústica.
          </p>
        </div>

        <div className="border-l-[3px] border-[#E8602A] pl-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#E8602A" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="2" stroke="#E8602A" strokeWidth="1.5"/>
            </svg>
            <p className="text-sm font-bold tracking-[2px] text-[#E8602A] uppercase">Nuestra Visión</p>
          </div>
          <p className="text-sm font-medium text-[#334155] leading-relaxed">
            Ser la plataforma e-commerce líder en vinilos y accesorios,
            redefiniendo la cultura musical local mediante la excelencia en
            curaduría y servicio.
          </p>
        </div>
      </section>
      <section className="px-6 md:px-12 py-12 md:py-16 bg-white text-center">
        <p className="text-[9px] tracking-[3px] text-[#E8602A] font-black uppercase mb-2">Quiénes somos</p>
        <h2
          className="font-black uppercase text-[#1a1a1a] mb-8"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(28px, 5vw, 40px)",
          }}
        >
          Compañeros de viaje sonoro
        </h2>
        <p className="text-xs text-[#555] leading-relaxed max-w-xl mx-auto mb-4">
          En La Disquería, no solo vendemos discos: somos emprendedores apasionados
          en la búsqueda del sonido perfecto. Nacimos como una plataforma cooperativa,
          creada firmemente por la música ante voluntades.
        </p>
        <p className="text-xs text-[#555] leading-relaxed max-w-xl mx-auto">
          Desde el desarrollo de nuestra plataforma con tecnología MERN hasta el momento
          en que el paquete llega a tu puerta, nuestro enfoque es la calidad absoluta.
          Queremos cada detalle, desde el empaque meticuloso hasta la verificación de
          presencia, asegurando que cada turno cuente su historia como fue diseñada.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 py-10 md:py-14 bg-[#F47E6A]">
        {[
          { icon: iconPush, title: "Experiencia VS Digital", text: "Recuperamos la emoción de tocar un disco. El arte del vinilo es la alternativa al ruido digital. El amor por el tacto y el viaje en la vida." },
          { icon: iconBuy, title: "Apoyo Escena Local", text: "Promovemos artistas y sellos salvadoreños, dando visibilidad a la escena musical local dentro y fuera del país." },
          { icon: iconCheck, title: "Alta Curaduría", text: "Cada disco en nuestro catálogo pasa por un proceso de selección riguroso. Calidad sobre cantidad, siempre." },
        ].map(({ icon, title, text }) => (
          <div key={title} className="flex flex-col items-start">
            <img src={icon} alt={title} className="w-8 h-8 object-contain mb-3" />
            <p className="text-[10px] font-semibold tracking-widest text-white uppercase mb-2">{title}</p>
            <p className="text-[11px] text-white/85 leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      <section className="px-6 md:px-12 py-12 md:py-16 bg-white">
        <p className="text-[9px] tracking-[3px] text-[#E8602A] font-black uppercase mb-2">Nuestro Equipo</p>
        <h2
          className="font-black uppercase text-[#1a1a1a] mb-10 md:mb-12"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(28px, 5vw, 38px)",
          }}
        >
          Las mentes detrás del<br />giradiscos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {teamMembers.map(({ name, lastName, role }) => (
            <div key={lastName} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#eee] mb-3 flex items-center justify-center overflow-hidden">
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="12" r="6" fill="#bbb" />
                  <ellipse cx="16" cy="26" rx="10" ry="6" fill="#bbb" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold text-[#1a1a1a] uppercase tracking-wide leading-tight">
                {name}<br />{lastName}
              </p>
              <p className="text-[10px] text-[#E8602A] mt-1">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}