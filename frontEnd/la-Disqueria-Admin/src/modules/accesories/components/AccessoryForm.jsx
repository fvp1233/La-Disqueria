"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/global/components/Input";
import { Label } from "@/global/components/Label";
import { Button } from "@/global/components/button";
import useDataAccessories from "@/modules/accesories/hooks/useDataAccesories";

const emptyValues = {
  name: "",
  brand: "",
  subtype: "",
  description: "",
  compatibleWith: "",
  material: "",
  price: "",
  tags: "",
  isAvailable: true,
};

export function AccessoryForm({ onClose, onSuccess, accessory, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode);
  const isReadOnly = internalMode === "view";

  const { saveAccessory, submitting, error } = useDataAccessories();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: emptyValues,
  });

  const imageFiles = watch("imageFile");
  const existingImage = accessory?.images?.[0];
  const preview = imageFiles?.[0] ? URL.createObjectURL(imageFiles[0]) : existingImage;

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  useEffect(() => {
    if (!accessory) {
      reset(emptyValues);
      return;
    }
    reset({
      name: accessory.name || "",
      brand: accessory.brand || "",
      subtype: accessory.subtype || "",
      description: accessory.description || "",
      compatibleWith: accessory.compatibleWith?.join(", ") || "",
      material: accessory.material || "",
      price: accessory.price || "",
      tags: accessory.tags?.join(", ") || "",
      isAvailable: accessory.isAvailable ?? true,
    });
  }, [accessory, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("subtype", data.subtype);
    formData.append("description", data.description);
    formData.append("material", data.material);
    formData.append("price", data.price);
    formData.append("isAvailable", data.isAvailable);
    formData.append(
      "compatibleWith",
      JSON.stringify(data.compatibleWith.split(",").map((v) => v.trim()).filter(Boolean))
    );
    formData.append(
      "tags",
      JSON.stringify(data.tags.split(",").map((v) => v.trim()).filter(Boolean))
    );

    if (data.imageFile?.[0]) {
      formData.append("images", data.imageFile[0]);
    }

    const success = await saveAccessory(accessory?._id || null, formData);
    if (success) onSuccess();
  };

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#4A6163]"
    }`;

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Imagen</Label>
          <div className="flex items-center gap-4">
            {preview ? (
              <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-lg border" />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
            )}
            {!isReadOnly && (
              <input type="file" accept="image/*" {...register("imageFile")} className="text-sm" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nombre</Label>
            <Input {...register("name", { required: "El nombre es requerido" })} disabled={isReadOnly} className={inputClass(errors.name)} />
            {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
          </div>

          <div>
            <Label>Marca</Label>
            <Input {...register("brand", { required: "La marca es requerida" })} disabled={isReadOnly} className={inputClass(errors.brand)} />
            {errors.brand && <span className="text-xs text-red-400">{errors.brand.message}</span>}
          </div>

          <div>
            <Label>Tipo</Label>
            <Input {...register("subtype")} disabled={isReadOnly} className={inputClass(errors.subtype)} />
          </div>

          <div>
            <Label>Precio</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("price", {
                required: "El precio es requerido",
                min: { value: 0, message: "El precio no puede ser negativo" },
              })}
              disabled={isReadOnly}
              className={inputClass(errors.price)}
            />
            {errors.price && <span className="text-xs text-red-400">{errors.price.message}</span>}
          </div>

          <div>
            <Label>Material</Label>
            <Input {...register("material")} disabled={isReadOnly} className={inputClass(errors.material)} />
          </div>

          <div>
            <Label>Compatible con (separado por comas)</Label>
            <Input {...register("compatibleWith")} disabled={isReadOnly} className={inputClass(errors.compatibleWith)} />
          </div>

          <div className="col-span-2">
            <Label>Tags (separados por comas)</Label>
            <Input {...register("tags")} disabled={isReadOnly} className={inputClass(errors.tags)} />
          </div>

          <div className="col-span-2">
            <Label>Descripción</Label>
            <Input {...register("description")} disabled={isReadOnly} className={inputClass(errors.description)} />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="isAvailable" {...register("isAvailable")} disabled={isReadOnly} />
            <Label htmlFor="isAvailable">Disponible</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 mb-2">
          <Button type="button" variant="cancel" onClick={onClose}>{isReadOnly ? "Cerrar" : "Cancelar"}</Button>
          {isReadOnly && (
            <Button type="button" variant="cd" onClick={() => setInternalMode("edit")}>Editar</Button>
          )}
          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : accessory ? "Actualizar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

export default AccessoryForm;
