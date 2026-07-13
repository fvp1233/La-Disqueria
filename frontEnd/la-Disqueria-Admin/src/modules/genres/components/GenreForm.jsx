"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Button } from "@/global/components/button"
import useGenres from "@/modules/genres/hooks/useGenres"

const defaultValues = {
  name: "",
}

export function GenreForm({ onClose, onSuccess, genre, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode)
  const isReadOnly = internalMode === "view"

  const { saveGenre, submitting } = useGenres()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  useEffect(() => {
    if (!genre) {
      reset(defaultValues)
      return
    }
    reset({ name: genre.name || "" })
  }, [genre, reset])

  const onSubmit = async (data) => {
    const success = await saveGenre(genre?._id || null, { name: data.name })
    if (success) onSuccess()
  }

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#4A6163]"
    }`

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Nombre del género *</Label>
          <Input
            {...register("name", { required: "El nombre del género es requerido" })}
            disabled={isReadOnly}
            placeholder="Ej: Rock, Jazz, Reggaetón"
            className={inputClass(errors.name)}
          />
          {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
        </div>

        <div className="flex justify-end gap-3 mt-4 mb-2">
          <Button type="button" variant="cancel" onClick={onClose}>{isReadOnly ? "Cerrar" : "Cancelar"}</Button>
          {isReadOnly && <Button type="button" onClick={() => setInternalMode("edit")} variant="cd">Editar</Button>}
          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : genre ? "Actualizar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </>
  )
}

export default GenreForm
