//Si cuando guardemos las imagenes de los discos en la db solo va la portada, cambiar el metodo de animacion al de Album.jsx porque ahi esta para que salga el vinilo
//Con la imagen de la portada, ahorita queda asi por que son imagenes quemadas


import { Link } from 'react-router-dom';

export function VinylCard({ product }) {
  // Formateador de precio para que siempre tenga el símbolo de $ y dos decimales. esto lo usaremos cuando este conectado a la api
  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    // Link envuelve toda la tarjeta. Al hacer hover, la imagen del disco se moverá.
    <Link to={`/products/${product.slug}`} className="group block w-full">
      <div className="flex flex-col items-center">
  
        {/*relative para que el disco se mueva dentro */}
        <div className="relative w-full aspect-3/2 mb-6 flex items-center justify-center overflow-hidden">
          
          {/* Imagen del Disco de Vinilo (Detrás) */}
          {/* Empieza ligeramente desplazado a la derecha y se mueve más en hover */}
          <img 
            src={product.vinylImage} 
            alt="Disco" 
            className="absolute right-0 h-[85%] w-auto object-contain transform translate-x-12 opacity-95 transition-transform duration-500 ease-out group-hover:translate-x-16"
          />
          
          {/* Imagen de la Portada (Delante) */}
          <img 
            src={product.coverImage} 
            alt={product.album} 
            className="relative z-10 h-full w-auto object-contain  rounded"
          />
        </div>

        <div className="text-center space-y-2 mt-4">
          
          {/* Artista y Título separados por guión */}
          <p className="text-sm font-light text-slate-800 tracking-tight leading-snug">
            {product.artist} <span className="text-slate-500">—</span> <span className="font-medium text-slate-900">{product.album}</span>
          </p>
          
          {/* Precio */}
          <p className="text-xl font-bold text-slate-950">
            {priceFormatter.format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}