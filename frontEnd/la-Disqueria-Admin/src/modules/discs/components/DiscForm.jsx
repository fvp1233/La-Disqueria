"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useDataVinyls from "@/modules/discs/hooks/useDataVinyls";
import { Form } from "@/global/components/Form";
import { Button } from "@/global/components/button";
import VinylImageForm from "./VinylImageForm";
import VinylBasicForm from "./VinylForm";
import VinylSpecsForm from "./VinylSpecsForm";
import VinylTracklistForm from "./VinylTrackListForm";

const emptyValues = {
  tittle: "",
  artistId: "",
  label: "",
  genre: "",
  year: "",
  format: "",
  speed: "",
  size: "",
  color: "",
  condition: "",
  price: "",
  tags: "",
  isAvailable: true,
  trackList: [],
};

export function DiscForm({ onClose, onSuccess, vinyl, mode = "edit", tipo = "vinilos" }) {
  const [internalMode, setInternalMode] = useState(mode);
  const isReadOnly = internalMode === "view";

  const { saveVinyl, submitting, error } = useDataVinyls();

  const methods = useForm({ defaultValues: emptyValues });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  useEffect(() => {
    setImageFile(null);

    if (!vinyl) {
      methods.reset(emptyValues);
      setPreview(null);
      return;
    }
    methods.reset({
      tittle: vinyl.tittle || "",
      artistId: vinyl.artistId?._id || vinyl.artistId || "",
      label: vinyl.label || "",
      genre: vinyl.genre || "",
      year: vinyl.year ? new Date(vinyl.year).toISOString().substring(0, 10) : "",
      format: vinyl.format || "",
      speed: vinyl.speed || "",
      size: vinyl.size || "",
      color: vinyl.color || "",
      condition: vinyl.condition || "",
      price: vinyl.price || "",
      tags: vinyl.tags || "",
      isAvailable: vinyl.isAvailable ?? true,
      trackList: vinyl.trackList || [],
    });
    const coverImage = vinyl.images?.find((img) => img.isCover)?.image || vinyl.images?.[0]?.image;
    setPreview(coverImage || null);
  }, [vinyl, methods]);

  const handleImageChange = (file) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("tittle", data.tittle);
    formData.append("artistId", data.artistId || "");
    formData.append("label", data.label);
    formData.append("genre", data.genre);
    formData.append("year", data.year);
    formData.append("format", data.format);
    formData.append("speed", data.speed);
    formData.append("size", data.size);
    formData.append("color", data.color);
    formData.append("condition", data.condition);
    formData.append("price", data.price);
    formData.append("tags", data.tags);
    formData.append("isAvailable", data.isAvailable);
    formData.append("trackList", JSON.stringify(data.trackList || []));

    if (imageFile) formData.append("images", imageFile);

    const success = await saveVinyl(vinyl?._id || null, formData);
    if (success) onSuccess();
  };

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset disabled={isReadOnly} className="space-y-8">
            <VinylImageForm preview={preview} onFileChange={handleImageChange} />
            <VinylBasicForm />
            <VinylSpecsForm />
            <VinylTracklistForm />
          </fieldset>

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
                {submitting ? "Guardando..." : vinyl ? "Actualizar" : `Guardar ${tipo === "cds" ? "CD" : "Disco"}`}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

export default DiscForm;
