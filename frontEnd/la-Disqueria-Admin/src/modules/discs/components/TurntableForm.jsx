"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/global/components/Input";
import { Label } from "@/global/components/Label";
import { Textarea } from "@/global/components/Textarea";
import { Button } from "@/global/components/button";
import { FormDropdown } from "@/global/components/FormDropdown";
import useDataTurntables from "@/modules/discs/hooks/useDataTurntables";

const emptyValues = {
  brand: "",
  model: "",
  type: "",
  description: "",
  driveType: "",
  speeds: "",
  hasUsb: "false",
  hasPreamp: "",
  output: "",
  torque: "",
  wow: "",
  warranty: "",
  price: "",
  tags: "",
  isAvailable: "true",
};

const usbOptions = [
  { label: "Sí", value: "true" },
  { label: "No", value: "false" },
];

const statusOptions = [
  { label: "Disponible", value: "true" },
  { label: "Agotado", value: "false" },
];

export function TurntableForm({ onClose, onSuccess, turntable, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode);
  const isReadOnly = internalMode === "view";

  const { saveTurntable, submitting } = useDataTurntables();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  const isAvailable = watch("isAvailable");
  const hasUsb = watch("hasUsb");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  useEffect(() => {
    setImageFile(null);

    if (!turntable) {
      reset(emptyValues);
      setPreview(null);
      return;
    }

    const specs = turntable.specs?.[0] || {};

    reset({
      brand: turntable.brand || "",
      model: turntable.model || "",
      type: turntable.type || "",
      description: turntable.description || "",
      driveType: specs.driveType || "",
      speeds: specs.speeds?.join(", ") || "",
      hasUsb: specs.hasUsb ? "true" : "false",
      hasPreamp: specs.hasPreamp || "",
      output: specs.output || "",
      torque: specs.torque || "",
      wow: specs.wow || "",
      warranty: turntable.warranty || "",
      price: turntable.price || "",
      tags: turntable.tags?.join(", ") || "",
      isAvailable: turntable.isAvailable === false ? "false" : "true",
    });
    setPreview(turntable.images?.[0]?.image || null);
  }, [turntable, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("type", data.type);
    formData.append("description", data.description);
    formData.append("warranty", data.warranty);
    formData.append("price", data.price);
    formData.append("isAvailable", data.isAvailable);

    formData.append(
      "specs",
      JSON.stringify([
        {
          driveType: data.driveType,
          speeds: data.speeds.split(",").map((v) => v.trim()).filter(Boolean),
          hasUsb: data.hasUsb === "true",
          hasPreamp: data.hasPreamp,
          output: data.output,
          torque: data.torque,
          wow: data.wow,
        },
      ])
    );

    formData.append(
      "tags",
      JSON.stringify(data.tags.split(",").map((v) => v.trim()).filter(Boolean))
    );

    if (imageFile) formData.append("images", imageFile);

    const success = await saveTurntable(turntable?._id || null, formData);
    if (success) onSuccess();
  };

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#4A6163]"
    }`;

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Foto */}
        <div className="space-y-2">
          <Label>Foto del tocadiscos</Label>
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center border shadow-inner">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 font-semibold">Sin foto</span>
              )}
            </div>

            {!isReadOnly && (
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm cursor-pointer file:border-0 file:bg-slate-200 file:text-slate-700 file:rounded-md file:text-xs file:font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Soporta formatos JPG, PNG o WebP.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Marca *</Label>
            <Input
              {...register("brand", { required: "La marca es obligatoria" })}
              disabled={isReadOnly}
              className={inputClass(errors.brand)}
            />
            {errors.brand && <span className="text-xs text-red-400">{errors.brand.message}</span>}
          </div>

          <div>
            <Label>Modelo *</Label>
            <Input
              {...register("model", { required: "El modelo es obligatorio" })}
              disabled={isReadOnly}
              className={inputClass(errors.model)}
            />
            {errors.model && <span className="text-xs text-red-400">{errors.model.message}</span>}
          </div>

          <div>
            <Label>Tipo</Label>
            <Input {...register("type")} disabled={isReadOnly} placeholder="Ej: Manual, Automático" className={inputClass(errors.type)} />
          </div>

          <div>
            <Label>Garantía</Label>
            <Input {...register("warranty")} disabled={isReadOnly} placeholder="Ej: 12 meses" className={inputClass(errors.warranty)} />
          </div>

          <div>
            <Label>Precio ($) *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("price", {
                required: "El precio es obligatorio",
                min: { value: 0, message: "El precio no puede ser negativo" },
              })}
              disabled={isReadOnly}
              className={inputClass(errors.price)}
            />
            {errors.price && <span className="text-xs text-red-400">{errors.price.message}</span>}
          </div>

          <div>
            <Label>Disponibilidad</Label>
            <FormDropdown
              options={statusOptions}
              value={isAvailable}
              onChange={(value) => setValue("isAvailable", value)}
              disabled={isReadOnly}
            />
          </div>

          <div className="col-span-2">
            <Label>Descripción</Label>
            <Textarea {...register("description")} disabled={isReadOnly} rows={3} />
          </div>

          <div>
            <Label>Tags (separados por comas)</Label>
            <Input {...register("tags")} disabled={isReadOnly} placeholder="Ej: Bluetooth, Vintage" className={inputClass(errors.tags)} />
          </div>
        </div>

        {/* Especificaciones técnicas */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-sm font-bold text-[#334647] uppercase">Especificaciones técnicas</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de tracción</Label>
              <Input {...register("driveType")} disabled={isReadOnly} placeholder="Ej: Correa, Directo" className={inputClass(errors.driveType)} />
            </div>

            <div>
              <Label>Velocidades (RPM, separadas por comas)</Label>
              <Input {...register("speeds")} disabled={isReadOnly} placeholder="Ej: 33, 45, 78" className={inputClass(errors.speeds)} />
            </div>

            <div>
              <Label>¿Tiene USB?</Label>
              <FormDropdown
                options={usbOptions}
                value={hasUsb}
                onChange={(value) => setValue("hasUsb", value)}
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label>Preamplificador</Label>
              <Input {...register("hasPreamp")} disabled={isReadOnly} placeholder="Ej: Sí, No, Conmutable" className={inputClass(errors.hasPreamp)} />
            </div>

            <div>
              <Label>Salida</Label>
              <Input {...register("output")} disabled={isReadOnly} placeholder="Ej: RCA, USB" className={inputClass(errors.output)} />
            </div>

            <div>
              <Label>Torque</Label>
              <Input {...register("torque")} disabled={isReadOnly} className={inputClass(errors.torque)} />
            </div>

            <div>
              <Label>Wow &amp; Flutter</Label>
              <Input {...register("wow")} disabled={isReadOnly} placeholder="Ej: 0.1% WRMS" className={inputClass(errors.wow)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="cancel" onClick={onClose}>
            {isReadOnly ? "Cerrar" : "Cancelar"}
          </Button>
          {isReadOnly && (
            <Button type="button" variant="cd" onClick={() => setInternalMode("edit")}>
              Editar
            </Button>
          )}
          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : turntable ? "Actualizar" : "Guardar Tocadiscos"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

export default TurntableForm;
