import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/global/components/Input";
import { Label } from "@/global/components/Label";
import { Button } from "@/global/components/button";
import useSuppliers from "@/modules/providers/hooks/useSuppliers";
import useProducts from "@/modules/providers/hooks/useProducts";

export function ProviderForm({ onClose, onSuccess, provider, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode);
  const isReadOnly = internalMode === "view";

  const { saveSupplier, submitting, error } = useSuppliers();
  const { allProducts } = useProducts();

  const [catalog, setCatalog] = useState([]);
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [search, setSearch] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      company: "", contact_name: "", email: "",
      phone: "", country: "", city: "",
    },
  });

  useEffect(() => { setInternalMode(mode); }, [mode]);

  useEffect(() => {
    if (!provider) {
      reset({ company: "", contact_name: "", email: "", phone: "", country: "", city: "" });
      setCatalog([]);
      return;
    }
    reset({
      company: provider.company || provider.companny || "",
      contact_name: provider.contact_name || "",
      email: provider.email || "",
      phone: provider.phone || "",
      country: provider.country || "",
      city: provider.city || "",
    });
    setCatalog(provider.catalog || []);
  }, [provider, reset]);

  const toggleProduct = (product) => {
    const exists = catalog.find(c => c._id === product._id);
    if (exists) {
      setCatalog(prev => prev.filter(c => c._id !== product._id));
    } else {
      setCatalog(prev => [...prev, {
        _id: product._id,
        type: product.type,
        title: product.displayName,
        price: product.price,
        isAvailable: product.isAvailable ?? true,
      }]);
    }
  };

  const onSubmit = async (data) => {
    const typeMapper = { vinyl: "vinyls", cd: "cds", turntable: "turntables", accessory: "accessories" };
    const payload = {
      ...data,
      catalog: catalog.map(c => ({
        type: typeMapper[c.type] || c.type,
        title: c.title,
        price: c.price,
        isAvailable: c.isAvailable,
      })),
    };
    const success = await saveSupplier(provider?._id || null, payload);
    if (success) onSuccess();
  };

  const filteredProducts = allProducts.filter(p =>
    p.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const typeLabel = (type) => {
    if (type === "vinyl" || type === "vinyls") return "Vinilo";
    if (type === "cd" || type === "cds") return "CD";
    if (type === "turntable" || type === "turntables") return "Tocadiscos";
    return "Accesorio";
  };

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#4A6163]"
    }`;

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">

          <div>
            <Label>Compañía</Label>
            <Input {...register("company", { required: "La compañía es requerida" })} disabled={isReadOnly} className={inputClass(errors.company)} />
            {errors.company && <span className="text-xs text-red-400">{errors.company.message}</span>}
          </div>

          <div>
            <Label>Nombre de contacto</Label>
            <Input {...register("contact_name", { required: "El nombre de contacto es requerido" })} disabled={isReadOnly} className={inputClass(errors.contact_name)} />
            {errors.contact_name && <span className="text-xs text-red-400">{errors.contact_name.message}</span>}
          </div>

          <div>
            <Label>Correo electrónico</Label>
            <Input
              {...register("email", {
                required: "El correo es requerido",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "El correo no es válido" },
              })}
              disabled={isReadOnly} className={inputClass(errors.email)}
            />
            {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
          </div>

          <div>
            <Label>Número de teléfono</Label>
            <Input
              {...register("phone", {
                required: "El teléfono es requerido",
                pattern: { value: /^\d{4}-\d{4}$/, message: "Formato requerido: XXXX-XXXX" },
              })}
              disabled={isReadOnly} placeholder="XXXX-XXXX" className={inputClass(errors.phone)}
            />
            {errors.phone && <span className="text-xs text-red-400">{errors.phone.message}</span>}
          </div>

          <div>
            <Label>País</Label>
            <Input {...register("country", { required: "El país es requerido" })} disabled={isReadOnly} className={inputClass(errors.country)} />
            {errors.country && <span className="text-xs text-red-400">{errors.country.message}</span>}
          </div>

          <div>
            <Label>Ciudad</Label>
            <Input {...register("city", { required: "La ciudad es requerida" })} disabled={isReadOnly} className={inputClass(errors.city)} />
            {errors.city && <span className="text-xs text-red-400">{errors.city.message}</span>}
          </div>

        </div>

        {/* Catálogo */}
        <div>
          <Label>Catálogo</Label>
          <div className="border rounded-xl p-3 h-40 flex flex-col gap-2 overflow-y-auto">
            {catalog.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-4">Sin productos en el catálogo</p>
            )}
            {catalog.map((c, i) => (
              <div key={i} className="flex items-center gap-3 border rounded-lg p-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-gray-400">{typeLabel(c.type)} • ${c.price}</p>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => setCatalog(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 text-xs hover:underline">
                    Quitar
                  </button>
                )}
              </div>
            ))}
            {!isReadOnly && (
              <button type="button" onClick={() => setOpenProductsModal(true)} className="text-sm text-red-400 mt-2 hover:bg-red-50 border p-1.5 rounded">
                + Agregar producto
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 mb-2">
          <Button variant="cancel" type="button" onClick={onClose}>{isReadOnly ? "Cerrar" : "Cancelar"}</Button>
          {isReadOnly && <Button type="button" onClick={() => setInternalMode("edit")} variant="cd">Editar</Button>}
          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : provider ? "Actualizar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>

      {/* Modal productos */}
      {openProductsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Seleccionar productos</h2>
              <input type="text" placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredProducts.map((prod) => {
                const isSelected = catalog.find(c => c._id === prod._id);
                return (
                  <div key={prod._id} onClick={() => toggleProduct(prod)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"}`}
                  >
                    {prod.images?.[0]?.image
                      ? <img src={prod.images[0].image} className="w-14 h-14 rounded-md object-cover" />
                      : <div className="w-14 h-14 rounded-md bg-gray-200" />
                    }
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{prod.displayName}</p>
                      <p className="text-xs text-gray-400">{typeLabel(prod.type)}</p>
                    </div>
                    <div className="text-sm font-semibold w-20 text-right">${prod.price || "-"}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{catalog.length} producto(s) seleccionado(s)</span>
              <Button variant="cancel" onClick={() => setOpenProductsModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}