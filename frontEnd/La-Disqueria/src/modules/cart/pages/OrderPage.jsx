import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import usePurchase from "@/modules/cart/hooks/usePurchase";
import { Button } from "@/global/components/button";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function OrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { submitPurchase, submitting, error } = usePurchase();

  const [form, setForm] = useState({
    street: "",
    city: "",
    payment_method: "Tarjeta",
    notes: "",
  });
  const [purchase, setPurchase] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleComprar = async () => {
    if (!user) {
      navigate("/registro", { state: { from: "/pedido" } });
      return;
    }

    try {
      const result = await submitPurchase({
        items,
        shipping_address: { street: form.street, city: form.city },
        payment_method: form.payment_method,
        notes: form.notes,
      });

      setPurchase(result);
      clearCart();
    } catch {
      // el error ya queda expuesto por usePurchase
    }
  };

  if (purchase) {
    return (
      <div className="container mx-auto max-w-lg py-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">¡Compra realizada!</h1>
        <p className="text-slate-600 mb-1">
          Número de pedido: <span className="font-semibold">{purchase.order_number}</span>
        </p>
        <p className="text-slate-600 mb-8">Total pagado: {priceFormatter.format(purchase.total)}</p>
        <Button size="lg" onClick={() => navigate("/products")}>
          Seguir comprando
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-lg py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Button size="lg" onClick={() => navigate("/products")}>
          Ver productos
        </Button>
      </div>
    );
  }

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto max-w-4xl py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Tu pedido</h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border-b border-slate-200 pb-4">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />

            <div className="flex-1">
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500">{priceFormatter.format(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="p-1.5 border border-slate-300 rounded hover:bg-slate-100"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="p-1.5 border border-slate-300 rounded hover:bg-slate-100"
              >
                <Plus className="size-3" />
              </button>
            </div>

            <p className="w-24 text-right font-semibold text-slate-900">
              {priceFormatter.format(item.price * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Información de envío</h2>

          {user ? (
            <p className="text-sm text-slate-600 mb-2">
              Comprando como <span className="font-medium">{user.name} {user.last_name}</span> ({user.email})
            </p>
          ) : (
            <p className="text-sm text-amber-600 mb-2">
              Debes registrarte e iniciar sesión para completar la compra.
            </p>
          )}

          <input
            name="street"
            placeholder="Dirección"
            value={form.street}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
          <input
            name="city"
            placeholder="Ciudad"
            value={form.city}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          >
            <option value="Tarjeta">Tarjeta</option>
            <option value="Efectivo contra entrega">Efectivo contra entrega</option>
          </select>
          <textarea
            name="notes"
            placeholder="Notas (opcional)"
            value={form.notes}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div className="bg-slate-50 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen</h2>

          <div className="flex justify-between text-sm mb-2 text-slate-600">
            <span>Subtotal</span>
            <span>{priceFormatter.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-slate-600">
            <span>Envío</span>
            <span>{shipping === 0 ? "Gratis" : priceFormatter.format(shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-4 mb-6 text-slate-900">
            <span>Total</span>
            <span>{priceFormatter.format(total)}</span>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <Button className="w-full" size="lg" disabled={submitting} onClick={handleComprar}>
            {submitting ? "Procesando..." : "Comprar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
