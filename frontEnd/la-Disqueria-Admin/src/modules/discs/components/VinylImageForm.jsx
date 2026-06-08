import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/global/components/Form";
import { Input } from "@/global/components/Input";

function VinylImageForm() {
  const {setValue, watch } = useFormContext();
  
  // Observamos el campo 'images' para poder mostrar una previsualización si ya existe una foto
  const currentImages = watch("images") || [];
  const coverImage = currentImages.find(img => img.isCover)?.image || currentImages[0]?.image;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Simulamos la estructura de tu esquema en Mongoose antes de enviarlo
      const nuevaImagen = {
        image: reader.result, 
        public_id: "temp_id",  
        isCover: true
      };
      
      // Guardamos el arreglo con la nueva imagen en React Hook Form
      setValue("images", [nuevaImagen] , { shouldValidate: true, shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <FormLabel className="text-xs font-bold uppercase text-slate-500">Portada del Álbum</FormLabel>
      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        
        <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center border shadow-inner">
          {coverImage ? (
            <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400 font-semibold">Sin portada</span>
          )}
        </div>

        <div className="flex-1">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="cursor-pointer file:border-0 file:bg-slate-200 file:text-slate-700 file:rounded-md file:text-xs file:font-semibold"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">Soporta formatos JPG, PNG o WebP.</p>
        </div>
      </div>
    </div>
  );
}

export default VinylImageForm;