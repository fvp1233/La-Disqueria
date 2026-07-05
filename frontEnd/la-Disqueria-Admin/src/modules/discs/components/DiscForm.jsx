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
  images: [],
  trackList: [],
};

export function DiscForm({ onClose, onSuccess, vinyl, mode = "edit", tipo = "vinilos" }) {
  const [internalMode, setInternalMode] = useState(mode);
  const isReadOnly = internalMode === "view";

  const { saveVinyl, submitting, error } = useDataVinyls();

  const methods = useForm({ defaultValues: emptyValues });

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  useEffect(() => {
    if (!vinyl) {
      methods.reset(emptyValues);
      return;
    }
    methods.reset({
      tittle: vinyl.tittle || "",
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
      images: vinyl.images || [],
      trackList: vinyl.trackList || [],
    });
  }, [vinyl, methods]);

  const onSubmit = async (data) => {
    const success = await saveVinyl(vinyl?._id || null, data);
    if (success) onSuccess();
  };

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset disabled={isReadOnly} className="space-y-8">
            <VinylImageForm />
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
