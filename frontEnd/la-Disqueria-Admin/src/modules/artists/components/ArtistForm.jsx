"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Textarea } from "@/global/components/Textarea"
import { Button } from "@/global/components/button"
import useArtists from "@/modules/artists/hooks/useArtists"

const defaultValues = {
  name: "",
  genre: "",
  origin: "",
  biography: "",
  spotify: "",
  instagram: "",
  website: "",
}

export function ArtistForm({ onClose, onSuccess, artist, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode)
  const isReadOnly = internalMode === "view"

  const { saveArtist, submitting, error } = useArtists()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  useEffect(() => {
    setImageFile(null)

    if (!artist) {
      reset(defaultValues)
      setPreview(null)
      return
    }
    reset({
      name: artist.name || "",
      genre: (artist.genre || []).join(", "),
      origin: artist.origin || "",
      biography: artist.biography || "",
      spotify: artist.social_links?.spotify || "",
      instagram: artist.social_links?.instagram || "",
      website: artist.social_links?.website || "",
    })
    setPreview(artist.image || null)
  }, [artist, reset])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("origin", data.origin)
    formData.append("biography", data.biography)
    formData.append(
      "genre",
      JSON.stringify(data.genre.split(",").map((v) => v.trim()).filter(Boolean))
    )
    formData.append(
      "social_links",
      JSON.stringify({
        spotify: data.spotify,
        instagram: data.instagram,
        website: data.website,
      })
    )

    if (imageFile) formData.append("image", imageFile)

    const success = await saveArtist(artist?._id || null, formData)
    if (success) onSuccess()
  }

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#4A6163]"
    }`

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Foto */}
        <div className="space-y-2">
          <Label>Foto del artista</Label>
          <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border shadow-inner">
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
                <p className="text-[11px] text-slate-400 mt-1.5">Soporta formatos JPG, PNG o GIF.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Nombre *</Label>
            <Input
              {...register("name", { required: "El nombre es requerido" })}
              disabled={isReadOnly}
              className={inputClass(errors.name)}
            />
            {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
          </div>

          <div>
            <Label>Géneros (separados por comas)</Label>
            <Input {...register("genre")} disabled={isReadOnly} placeholder="Ej: Rock, Pop" className={inputClass(errors.genre)} />
          </div>

          <div>
            <Label>Origen</Label>
            <Input {...register("origin")} disabled={isReadOnly} placeholder="Ej: Reino Unido" className={inputClass(errors.origin)} />
          </div>

          <div className="col-span-2">
            <Label>Biografía</Label>
            <Textarea {...register("biography")} disabled={isReadOnly} className={inputClass(errors.biography)} />
          </div>

          <div>
            <Label>Spotify</Label>
            <Input {...register("spotify")} disabled={isReadOnly} placeholder="https://open.spotify.com/artist/..." className={inputClass(errors.spotify)} />
          </div>

          <div>
            <Label>Instagram</Label>
            <Input {...register("instagram")} disabled={isReadOnly} placeholder="https://instagram.com/..." className={inputClass(errors.instagram)} />
          </div>

          <div className="col-span-2">
            <Label>Sitio web</Label>
            <Input {...register("website")} disabled={isReadOnly} placeholder="https://..." className={inputClass(errors.website)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 mb-2">
          <Button type="button" variant="cancel" onClick={onClose}>{isReadOnly ? "Cerrar" : "Cancelar"}</Button>
          {isReadOnly && <Button type="button" onClick={() => setInternalMode("edit")} variant="cd">Editar</Button>}
          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : artist ? "Actualizar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </>
  )
}

export default ArtistForm
