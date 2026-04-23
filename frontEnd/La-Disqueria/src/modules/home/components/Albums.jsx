import React, { useState } from 'react';
import { INTERACTIVE_ALBUMS } from '@/global/data/albumns.js';

export function Albums() {
  const [openId, setOpenId] = useState(1);

  return (
    <section className="w-full py-20 bg-[#d5d5d5] flex flex-col items-center overflow-hidden">
      <h2 className="text-3xl font-bold mb-16 text-slate-900 uppercase tracking-widest">
       Encuentra tu Album favorito
      </h2>

      {/* Contenedor Grandes */}
      <div className="flex flex-wrap justify-center gap-20 md:gap-32 mb-12">
        {INTERACTIVE_ALBUMS.filter(a => a.size === "large").map((album) => (
          <AlbumItem 
            key={album.id}
            album={album}
            isOpen={openId === album.id}
            onToggle={() => setOpenId(album.id)}
          />
        ))}
      </div>

      {/* Contenedor Pequeños */}
      <div className="flex flex-wrap justify-center gap-10 md:gap-16 mt-10">
        {INTERACTIVE_ALBUMS.filter(a => a.size === "small").map((album) => (
          <AlbumItem 
            key={album.id}
            album={album}
            isOpen={openId === album.id}
            onToggle={() => setOpenId(album.id)}
            isSmall
          />
        ))}
      </div>
    </section>
  );
}

function AlbumItem({ album, isOpen, onToggle, isSmall }) {
  // Configuración de tamaños dinámicos
  const sizeClasses = isSmall 
    ? "w-[160px] h-[160px] [--cover-t:-10px] [--vinyl-t:55%]" 
    : "w-[300px] h-[300px] [--cover-t:-20px] [--vinyl-t:55%]";

  return (
    <div 
      onClick={onToggle}
      className={`group relative cursor-pointer transition-transform duration-300 ${sizeClasses} ${isOpen ? 'is-open' : ''}`}
    >
      {/* PORTADA (Cover) */}
      <div className={`
        relative z-10 w-full h-full overflow-hidden rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.4)]
        transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        group-hover:translate-x-[var(--cover-t)] group-hover:-rotate-3
        ${isOpen ? 'translate-x-[var(--cover-t)] -rotate-3' : ''}
      `}>
        <img src={album.cover} alt="Portada" className="w-full h-full object-cover" />
        
        {/* Reflejo de luz en la portada */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-60" />
      </div>

      {/* VINILO*/}
      <div className={`
        absolute top-[5%] right-0 w-[90%] h-[90%] rounded-full bg-[#0a0a0a] z-0
        flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.6)]
        transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        rotate-[270deg]
        
        /* Efecto de surcos y brillo cónico con clases arbitrarias */
        bg-[conic-gradient(from_50deg_at_50%_50%,transparent_46%,rgba(255,255,255,0.1)_50%,transparent_56%),repeating-radial-gradient(circle,rgba(255,255,255,0.03)_0px,transparent_1px,transparent_4px)]
        
        group-hover:translate-x-[var(--vinyl-t)] group-hover:rotate-[360deg]
        ${isOpen ? 'translate-x-[var(--vinyl-t)] rotate-[360deg] animate-[spin_8s_linear_infinite_0.7s]' : ''}
      `}>
        {/* Centro del disco */}
        <div 
          className="w-[35%] h-[35%] rounded-full bg-cover bg-center shadow-[0_0_0_5px_#000]"
          style={{ backgroundImage: `url(${album.cover})` }}
        />
      </div>
    </div>
  );
}