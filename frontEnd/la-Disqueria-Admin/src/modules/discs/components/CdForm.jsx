"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/global/components/Input";
import { Label } from "@/global/components/Label";
import { Button } from "@/global/components/button";
import { FormDropdown } from "@/global/components/FormDropdown";
import useDataCds from "@/modules/discs/hooks/useDataCds";

const emptyValues = {
  title: "",
  label: "",
  genre: "",
  year: "",
  format: "",
  album_duration: "",
  edition: "",
  price: "",
  tags: "",
  isAvailable: "true",
  tracks: [],
};

export function CdForm({ onClose, onSuccess, cd, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode);
  const isReadOnly = internalMode === "view";

  const { saveCd, submitting, error } = useDataCds();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({ defaultValues: emptyValues });

  const { fields, append, remove } = useFieldArray({ control, name: "tracks" });

  const isAvailable = watch("isAvailable");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const statusOptions = [
    { label: "Disponible", value: "true" },
    { label: "Agotado", value: "false" },
  ];

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  useEffect(() => {
    setImageFile(null);

    if (!cd) {
      reset(emptyValues);
      setPreview(null);
      return;
    }

    reset({
      title: cd.title || "",
      label: cd.label || "",
      genre: cd.genre?.join(", ") || "",
      year: cd.year || "",
      format: cd.format || "",
      album_duration: cd.album_duration || "",
      edition: cd.edition || "",
      price: cd.price || "",
      tags: cd.tags?.join(", ") || "",
      isAvailable: cd.isAvailable === false ? "false" : "true",
      tracks: cd.tracks || [],
    });
    setPreview(cd.images?.[0]?.image || null);
  }, [cd, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("label", data.label);
    formData.append("year", data.year);
    formData.append("format", data.format);
    formData.append("album_duration", data.album_duration);
    formData.append("edition", data.edition);
    formData.append("price", data.price);
    formData.append("isAvailable", data.isAvailable);

    formData.append(
      "genre",
      JSON.stringify(data.genre.split(",").map((v) => v.trim()).filter(Boolean))
    );
    formData.append(
      "tags",
      JSON.stringify(data.tags.split(",").map((v) => v.trim()).filter(Boolean))
    );
    formData.append("tracks", JSON.stringify(data.tracks));

    if (imageFile) formData.append("images", imageFile);

    const success = await saveCd(cd?._id || null, formData);
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

        {/* Portada */}
        <div className="space-y-2">
          <Label>Portada del álbum</Label>
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center border shadow-inner">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 font-semibold">Sin portada</span>
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
            <Label>Título *</Label>
            <Input
              {...register("title", { required: "El título es obligatorio" })}
              disabled={isReadOnly}
              className={inputClass(errors.title)}
            />
            {errors.title && <span className="text-xs text-red-400">{errors.title.message}</span>}
          </div>

          <div>
            <Label>Sello (Label)</Label>
            <Input {...register("label")} disabled={isReadOnly} className={inputClass(errors.label)} />
          </div>

          <div>
            <Label>Género</Label>
            <Input {...register("genre")} disabled={isReadOnly} placeholder="Ej: Pop, Rock" className={inputClass(errors.genre)} />
          </div>

          <div>
            <Label>Año</Label>
            <Input {...register("year")} disabled={isReadOnly} placeholder="Ej: 2020" className={inputClass(errors.year)} />
          </div>

          <div>
            <Label>Formato</Label>
            <Input {...register("format")} disabled={isReadOnly} placeholder="Ej: CD, Álbum" className={inputClass(errors.format)} />
          </div>

          <div>
            <Label>Edición</Label>
            <Input {...register("edition")} disabled={isReadOnly} className={inputClass(errors.edition)} />
          </div>

          <div>
            <Label>Duración del álbum</Label>
            <Input {...register("album_duration")} disabled={isReadOnly} placeholder="Ej: 42:30" className={inputClass(errors.album_duration)} />
          </div>

          <div>
            <Label>Precio ($) *</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", { required: "El precio es obligatorio" })}
              disabled={isReadOnly}
              className={inputClass(errors.price)}
            />
            {errors.price && <span className="text-xs text-red-400">{errors.price.message}</span>}
          </div>

          <div>
            <Label>Tags (separados por comas)</Label>
            <Input {...register("tags")} disabled={isReadOnly} placeholder="Ej: Remastered, Edición limitada" className={inputClass(errors.tags)} />
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
        </div>

        {/* Tracklist */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#334647] uppercase">Lista de canciones</h3>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => append({ position: fields.length + 1, title: "", duration: "" })}
                className="px-3 py-1.5 text-xs font-semibold bg-[#4A6163] text-white rounded-lg hover:bg-[#334647] transition"
              >
                + Agregar pista
              </button>
            )}
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No has agregado pistas a este álbum todavía.</p>
          ) : (
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    {...register(`tracks.${index}.position`)}
                    placeholder="N°"
                    disabled={isReadOnly}
                    className="w-14 p-2 bg-white border border-slate-200 rounded-lg text-center text-xs focus:outline-none focus:border-[#4A6163]"
                  />
                  <input
                    {...register(`tracks.${index}.title`)}
                    placeholder="Nombre de la canción"
                    disabled={isReadOnly}
                    className="flex-1 min-w-37.5 p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#4A6163]"
                  />
                  <input
                    {...register(`tracks.${index}.duration`)}
                    placeholder="Duración"
                    disabled={isReadOnly}
                    className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-center text-xs focus:outline-none focus:border-[#4A6163]"
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs transition font-semibold"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
              {submitting ? "Guardando..." : cd ? "Actualizar" : "Guardar CD"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

export default CdForm;
