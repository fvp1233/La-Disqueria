import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/global/components/Form";
import { Input } from "@/global/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/global/components/select";

function VinylSpecsForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Formato</FormLabel>
              <FormControl>
                <Input placeholder="Ej: LP, Album" {...field} className="rounded-xl" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="speed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Velocidad</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 33 RPM" {...field} className="rounded-xl" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Tamaño</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 12\"{...field} className="rounded-xl" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Color</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Black Standard" {...field} className="rounded-xl" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Condición</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mint (M)" {...field} className="rounded-xl" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="price"
          rules={{ required: "El precio es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Precio ($) *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} className="rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Disponibilidad</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Disponible</SelectItem>
                  <SelectItem value="false">Agotado</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-slate-500">Tags (Separados por comas)</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 180g, Gatefold, Remastered" {...field} className="rounded-xl" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default VinylSpecsForm;