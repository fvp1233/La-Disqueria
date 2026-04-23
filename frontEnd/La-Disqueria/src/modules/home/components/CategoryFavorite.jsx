import { Link } from "react-router-dom";
import React from "react";
import vinylsBanner from '@/assets/vinylsBanner.png'
import cdsBanner from '@/assets/cdsBanner.png'
import tocadiscosBanner from '@/assets/tocadiscosBanner.png'


const CATEGORIES = [
  {
    id: 1,
    title: 'Vinilos',
    subtitle: 'Lo último en vinilos',
    image: vinylsBanner, // Reemplaza con una imagen real de portada
    link: '/products?filter=new'
  },
  {
    id: 2,
    title: 'CDS',
    subtitle: 'Ediciones especiales',
    image: cdsBanner, // Reemplaza con otra imagen
    link: '/products?filter=special'
  },
  {
    id: 3,
    title: 'Toca discos',
    subtitle: 'Productos atemporales',
    image: tocadiscosBanner, // Reemplaza con otra imagen
    link: '/products?filter=classics'
  }
];

export function CategoryFavorite() {
  return (
    <section className="w-full mt-20 mb-0">
      <div className="flex flex-col md:flex-row h-150 md:h-125">
        
        {CATEGORIES.map((category) => (
          <Link 
            key={category.id} 
            to={category.link}
            className="relative flex-1 group overflow-hidden  bg-slate-100 transition-all duration-700 ease-in-out hover:flex-2 shadow-xl hover:shadow-2xl"
          >
            {/* Imagen de fondo con efecto de zoom */}
            <img 
              src={category.image} 
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Superposición degradada (Overlay) para legibilidad del texto */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-8 flex flex-col justify-end">
              
              {/* Contenido de texto */}
              <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-sm font-medium text-white/70 uppercase tracking-widest">
                  {category.subtitle}
                </span>
                <h3 className="text-3xl font-extrabold text-white tracking-tighter">
                  {category.title}
                </h3>
              </div>
              
              {/* Botón "Ver más" que aparece en hover */}
              <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                 <span className="inline-block bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-widest">
                   Explorar →
                 </span>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}