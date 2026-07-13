// pages/product-detail-page.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/global/components/button';
import useProductDetail from '@/modules/products/hooks/useProductDetail';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  // Extraemos el 'slug' de la URL (id real del producto en la base de datos)
  const { slug } = useParams();

  const { product, loading, error, notFound } = useProductDetail(slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return <p className="container mx-auto py-20 text-center text-slate-400">Cargando producto...</p>;
  }

  if (error) {
    return <p className="container mx-auto py-20 text-center text-red-500">{error}</p>;
  }

  if (notFound) {
    return <p className="container mx-auto py-20 text-center text-slate-400">Producto no encontrado.</p>;
  }

  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="container mx-auto py-20 flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1">
        <img src={product.coverImage} alt={product.album} className="w-full shadow-2xl" />
      </div>

      <div className="flex-1 space-y-6">
        <h1 className="text-4xl font-bold">
          {product.artist ? `${product.artist} — ${product.album}` : product.album}
        </h1>
        <p className="text-2xl text-primary">{priceFormatter.format(product.price)}</p>
        {product.genre && <p className="text-gray-600">Género: {product.genre}</p>}
        <p className={product.isAvailable ? "text-green-600" : "text-red-500"}>
          {product.isAvailable ? "Disponible" : "Agotado"}
        </p>

        {product.isAvailable && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 border border-slate-300 rounded hover:bg-slate-100"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 border border-slate-300 rounded hover:bg-slate-100"
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}

        <Button
          size="lg"
          disabled={!product.isAvailable}
          onClick={() => {
            addItem(product, quantity);
            setQuantity(1);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
        >
          {added ? "¡Añadido!" : "Añadir al carrito"}
        </Button>
      </div>
    </div>
  );
}
