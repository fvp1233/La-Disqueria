// pages/catalog-page.jsx
import { VinylCard } from '../components/VinylCard';
import biteMeImg from '@/assets/biteme.png';
import { VINYLS_DATA } from '@/global/data/vinyls';


console.log('imagen', biteMeImg);


export default function CatalogPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-10">Catálogo Completo</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {VINYLS_DATA.map((item) => (
          <VinylCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}