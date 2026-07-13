import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/global/components/Form";
import { Input } from "@/global/components/Input";

function VinylTracklistForm() {
  const { control, register } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trackList",
  });

  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#334647]">Lista de Canciones (Tracklist)</h3>
        <button
          type="button"
          onClick={() => append({ side: "", position: "", song_name: "", duration: "" })}
          className="px-3 py-1.5 text-xs font-semibold bg-[#4A6163] text-white rounded-lg hover:bg-[#334647] transition"
        >
          + Agregar Pista
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No has agregado pistas a este álbum todavía.</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                {...register(`trackList.${index}.side`)}
                placeholder="Lado"
                className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-center text-xs focus:outline-none focus:border-[#4A6163]"
              />

              <input
                {...register(`trackList.${index}.position`)}
                placeholder="N°"
                className="w-12 p-2 bg-white border border-slate-200 rounded-lg text-center text-xs focus:outline-none focus:border-[#4A6163]"
              />

              <input
                {...register(`trackList.${index}.song_name`)}
                placeholder="Nombre de la canción"
                className="flex-1 min-w-37.5 p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#4A6163]"
              />

              <input
                {...register(`trackList.${index}.duration`)}
                placeholder="Duración"
                className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-center text-xs focus:outline-none focus:border-[#4A6163]"
              />
              
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs transition font-semibold"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VinylTracklistForm;