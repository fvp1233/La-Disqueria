import React from "react";
import {useFormContext} from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/global/components/Form'
import {Input} from '@/global/components/Input'

function VinylBasicForm() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="tittle"
        rules={{ required: "El título es obligatorio" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-slate-500">Título *</FormLabel>
            <FormControl>
              <Input placeholder="Ej: AM" {...field} className="rounded-xl border-slate-200 focus-visible:ring-[#4A6163]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="genre"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-slate-500">Género</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Indie Rock" {...field} className="rounded-xl border-slate-200 focus-visible:ring-[#4A6163]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-slate-500">Sello (Label)</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Domino Recording Co." {...field} className="rounded-xl border-slate-200 focus-visible:ring-[#4A6163]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-slate-500">Fecha de Lanzamiento</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="rounded-xl border-slate-200 focus-visible:ring-[#4A6163]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default VinylBasicForm;