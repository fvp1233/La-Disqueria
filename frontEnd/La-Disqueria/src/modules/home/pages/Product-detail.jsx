// pages/product-detail-page.jsx
import { useParams } from 'react-router-dom';
import { Button } from '@/global/components/button';

export default function ProductDetailPage() {
  // Extraemos el 'slug' de la URL (ej: /producto/bad-bunny-fotos)
  const { slug } = useParams();

  // Aquí deberías buscar en tu base de datos o estado global el disco que coincida con el slug

  return (
    <div className="container mx-auto py-20 flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1">
        <img src="/path-to-large-image.jpg" alt="Portada grande" className="w-full shadow-2xl" />
      </div>
      
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl font-bold">Información del Producto: {slug}</h1>
        <p className="text-2xl text-primary">$50.00</p>
        <p className="text-gray-600">
          Aquí va toda la descripción detallada del vinilo, lista de canciones, etc.
        </p>
        <Button size="lg">Añadir al carrito</Button>
      </div>
    </div>
  );
}