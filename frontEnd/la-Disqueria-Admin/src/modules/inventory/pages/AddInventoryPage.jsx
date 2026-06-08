import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { inventoryService } from "../../../service/inventoryService";
import { suppliersService } from "../../../service/supplierService";
import { vinylsService } from "../../../service/vinylsService";
import { cdsService } from "../../../service/cdsService";
import { turntablesService } from "../../../service/turntablesService";
import { accessoriesService } from "../../../service/accesoriesService";

const productServiceMap = {
  vinyl: vinylsService,
  cd: cdsService,
  turntable: turntablesService,
  accessory: accessoriesService,
};

const getProductName = (product, type) => {
  if (type === "vinyl") return product.tittle || product.title;
  if (type === "cd") return product.title;
  if (type === "turntable") return `${product.brand} ${product.model}`;
  if (type === "accessory") return product.name || product.title;
  return product._id;
};

export default function AddInventoryPage() {
  const navigate = useNavigate();

  const [editItem, setEditItem] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Observa el tipo para cargar productos dinámicamente
  const selectedType = watch("productType");

  // Carga suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await suppliersService.getAll();
        setSuppliers(data);
      } catch (err) {
        console.error("Error al cargar suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Carga productos según el tipo seleccionado
  useEffect(() => {
    if (!selectedType) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const service = productServiceMap[selectedType];
        if (!service) return;
        const data = await service.getAll();
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedType]);

  // Carga datos si es edición
  useEffect(() => {
    const editData = JSON.parse(localStorage.getItem("editInventory"));
    if (editData) {
      setEditItem(editData);
      reset({
        productType: editData.productType || "",
        productId: editData.productId || "",
        sku: editData.sku || "",
        stock: editData.stock || 1,
        location: editData.location || "",
        supplierId:
          editData.supplierId?.[0]?.supplierId?._id ||
          editData.supplierId?.[0]?.supplierId ||
          "",
      });
    }
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        productId: data.productId,
        productType: data.productType,
        sku: data.sku,
        stock: Number(data.stock),
        location: data.location,
        supplierId: data.supplierId ? [{ supplierId: data.supplierId }] : [],
      };

      if (editItem) {
        await inventoryService.update(editItem._id, payload);
        localStorage.removeItem("editInventory");
      } else {
        await inventoryService.create(payload);
      }

      navigate("/inventory");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `border rounded-lg px-3 py-2 text-sm outline-none transition-colors w-full ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#4A6163]"
    }`;

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#334647] mb-6">
          {editItem ? "Editar Inventario" : "Agregar Producto"}
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="grid grid-cols-2 gap-4">

              {/* Tipo de Producto */}
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
                {errors.productType && (
                  <span className="text-xs text-red-400">{errors.productType.message}</span>
                )}
              </div>

              {/* Producto — depende del tipo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Producto</label>
                <select
                  {...register("productId", { required: "El producto es requerido" })}
                  className={inputClass(errors.productId)}
                  disabled={!selectedType || loadingProducts}
                >
                  <option value="">
                    {!selectedType
                      ? "Selecciona un tipo primero"
                      : loadingProducts
                      ? "Cargando productos..."
                      : "Seleccionar producto"}
                  </option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {getProductName(p, selectedType)}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <span className="text-xs text-red-400">{errors.productId.message}</span>
                )}
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">SKU</label>
                <input
                  {...register("sku", { required: "El SKU es requerido" })}
                  placeholder="Ej: VNL-KOB-001"
                  className={inputClass(errors.sku)}
                />
                {errors.sku && (
                  <span className="text-xs text-red-400">{errors.sku.message}</span>
                )}
              </div>

              {/* Stock */}
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
                {errors.stock && (
                  <span className="text-xs text-red-400">{errors.stock.message}</span>
                )}
              </div>

              {/* Ubicación */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Ubicación</label>
                <input
                  {...register("location", { required: "La ubicación es requerida" })}
                  placeholder="Ej: Estante A-1"
                  className={inputClass(errors.location)}
                />
                {errors.location && (
                  <span className="text-xs text-red-400">{errors.location.message}</span>
                )}
              </div>

              {/* Proveedor */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Proveedor</label>
                <select
                  {...register("supplierId")}
                  className={inputClass(errors.supplierId)}
                >
                  <option value="">Seleccionar proveedor</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.companny || s.company || s.contact_name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("editInventory");
                  navigate(-1);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#4A6163] text-white rounded-lg text-sm disabled:opacity-50 hover:bg-[#3a5152] transition-colors"
              >
                {loading ? "Guardando..." : editItem ? "Actualizar" : "Guardar"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}