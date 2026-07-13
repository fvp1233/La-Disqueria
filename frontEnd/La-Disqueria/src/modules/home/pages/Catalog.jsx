// pages/catalog-page.jsx
import { VinylCard } from '../components/VinylCard';
import useCatalog from '@/modules/products/hooks/useCatalog';

export default function CatalogPage() {
  const { catalog, loading, error } = useCatalog();

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-10">Catálogo Completo</h1>

      {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

      {loading ? (
        <p className="text-slate-400">Cargando catálogo...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {catalog.map((item) => (
            <VinylCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}