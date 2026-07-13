"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Textarea } from "@/global/components/Textarea"
import { Button } from "@/global/components/button"
import useArtists from "@/modules/artists/hooks/useArtists"
import useGenres from "@/modules/genres/hooks/useGenres"

const defaultValues = {
  name: "",
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
  const { genres } = useGenres()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  const [selectedGenres, setSelectedGenres] = useState([])
  const [openGenresModal, setOpenGenresModal] = useState(false)
  const [genreSearch, setGenreSearch] = useState("")

  const toggleGenre = (genre) => {
    const exists = selectedGenres.find((g) => g._id === genre._id)
    if (exists) {
      setSelectedGenres((prev) => prev.filter((g) => g._id !== genre._id))
    } else {
      setSelectedGenres((prev) => [...prev, genre])
    }
  }

  const filteredGenres = genres.filter((g) =>
    g.name?.toLowerCase().includes(genreSearch.toLowerCase())
  )

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  useEffect(() => {
    setImageFile(null)

    if (!artist) {
      reset(defaultValues)
      setSelectedGenres([])
      setPreview(null)
      return
    }
    reset({
      name: artist.name || "",
      origin: artist.origin || "",
      biography: artist.biography || "",
      spotify: artist.social_links?.spotify || "",
      instagram: artist.social_links?.instagram || "",
      website: artist.social_links?.website || "",
    })
    setPreview(artist.image || null)
  }, [artist, reset])

  useEffect(() => {
    if (!artist) return
    const artistGenreNames = artist.genre || []
    setSelectedGenres(genres.filter((g) => artistGenreNames.includes(g.name)))
  }, [artist, genres])

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
    formData.append("genre", JSON.stringify(selectedGenres.map((g) => g.name)))
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
            <Label>Géneros</Label>
            <div className="border rounded-lg p-2 h-[74px] flex flex-col gap-1.5 overflow-y-auto">
              {selectedGenres.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-2">Sin géneros seleccionados</p>
              )}
              {selectedGenres.map((g) => (
                <div key={g._id} className="flex items-center gap-2 border rounded-md px-2 py-1">
                  <p className="flex-1 text-xs font-medium">{g.name}</p>
                  {!isReadOnly && (
                    <button type="button" onClick={() => toggleGenre(g)} className="text-red-400 text-xs hover:underline">
                      Quitar
                    </button>
                  )}
                </div>
              ))}
              {!isReadOnly && (
                <button type="button" onClick={() => setOpenGenresModal(true)} className="text-xs text-red-400 hover:bg-red-50 border p-1 rounded">
                  + Agregar género
                </button>
              )}
            </div>
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

      {/* Modal géneros */}
      {openGenresModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Seleccionar géneros</h2>
              <input type="text" placeholder="Buscar por nombre..." value={genreSearch} onChange={(e) => setGenreSearch(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredGenres.map((g) => {
                const isSelected = selectedGenres.find((sel) => sel._id === g._id)
                return (
                  <div key={g._id} onClick={() => toggleGenre(g)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{g.name}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{selectedGenres.length} género(s) seleccionado(s)</span>
              <Button variant="cancel" onClick={() => setOpenGenresModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ArtistForm
