import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/global/components/button";
import useInventory from "@/modules/inventory/hooks/useInventory";
import useSuppliers from "@/modules/providers/hooks/useSuppliers";
import useDataVinyls from "@/modules/discs/hooks/useDataVinyls";
import useDataCds from "@/modules/discs/hooks/useDataCds";
import useDataTurntables from "@/modules/discs/hooks/useDataTurntables";
import useDataAccessories from "@/modules/accesories/hooks/useDataAccesories";

const getProductName = (product, type) => {
  if (type === "vinyl") return product.tittle || product.title;
  if (type === "cd") return product.title;
  if (type === "turntable") return `${product.brand} ${product.model}`;
  if (type === "accessory") return product.name || product.title;
  return product._id;
};

export function InventoryForm({ onClose, onSuccess, item }) {
  const { saveInventory, submitting, error } = useInventory();
  const { suppliers } = useSuppliers();

  // Hooks de productos — carga todos pero solo usamos el del tipo seleccionado
  const { dataVinyls } = useDataVinyls();
  const { dataCds } = useDataCds();
  const { dataTurntables } = useDataTurntables();
  const { dataAccessories } = useDataAccessories();

  const productMap = {
    vinyl: dataVinyls,
    cd: dataCds,
    turntable: dataTurntables,
    accessory: dataAccessories,
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productType: "",
      productId: "",
      sku: "",
      stock: 1,
      location: "",
      supplierId: "",
    },
  });

  const selectedType = watch("productType");
  const products = productMap[selectedType] || [];

  useEffect(() => {
    if (!item) {
      reset({ productType: "", productId: "", sku: "", stock: 1, location: "", supplierId: "" });
      return;
    }
    reset({
      productType: item.productType || "",
      productId: item.productId || "",
      sku: item.sku || "",
      stock: item.stock || 1,
      location: item.location || "",
      supplierId:
        item.supplierId?.[0]?.supplierId?._id ||
        item.supplierId?.[0]?.supplierId ||
        "",
    });
  }, [item, reset]);

  const onSubmit = async (data) => {
    const payload = {
      productId: data.productId,
      productType: data.productType,
      sku: data.sku,
      stock: Number(data.stock),
      location: data.location,
      supplierId: data.supplierId ? [{ supplierId: data.supplierId }] : [],
    };
    const success = await saveInventory(item?._id || null, payload);
    if (success) onSuccess();
  };

  const inputClass = (hasError) =>
    `border rounded-lg px-3 py-2 text-sm outline-none transition-colors w-full ${
      hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#4A6163]"
    }`;

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Tipo de Producto</label>
            <select
              {...register("productType", { required: "El tipo es requerido" })}
              className={inputClass(errors.productType)}
            >
              <option value="">Seleccionar tipo</option>
              <option value="vinyl">Vinilo</option>
              <option value="turntable">Tocadiscos</option>
              <option value="cd">CD</option>
              <option value="accessory">Accesorio</option>
            </select>
            {errors.productType && <span className="text-xs text-red-400">{errors.productType.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Producto</label>
            <select
              {...register("productId", { required: "El producto es requerido" })}
              className={inputClass(errors.productId)}
              disabled={!selectedType}
            >
              <option value="">
                {!selectedType ? "Selecciona un tipo primero" : "Seleccionar producto"}
              </option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {getProductName(p, selectedType)}
                </option>
              ))}
            </select>
            {errors.productId && <span className="text-xs text-red-400">{errors.productId.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">SKU</label>
            <input
              {...register("sku", { required: "El SKU es requerido" })}
              placeholder="Ej: VNL-KOB-001"
              className={inputClass(errors.sku)}
            />
            {errors.sku && <span className="text-xs text-red-400">{errors.sku.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Stock</label>
            <input
              type="number"
              {...register("stock", {
                required: "El stock es requerido",
                min: { value: 0, message: "El stock no puede ser negativo" },
              })}
              placeholder="Cantidad"
              className={inputClass(errors.stock)}
            />
            {errors.stock && <span className="text-xs text-red-400">{errors.stock.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Ubicación</label>
            <input
              {...register("location", { required: "La ubicación es requerida" })}
              placeholder="Ej: Estante A-1"
              className={inputClass(errors.location)}
            />
            {errors.location && <span className="text-xs text-red-400">{errors.location.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Proveedor</label>
            <select {...register("supplierId")} className={inputClass(false)}>
              <option value="">Seleccionar proveedor</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.companny || s.company || s.contact_name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="cancel" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="cd" disabled={submitting}>
            {submitting ? "Guardando..." : item ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </>
  );
}