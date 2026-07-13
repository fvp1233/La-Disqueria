import React, { useEffect, useState } from "react";
import { useFormContext } from 'react-hook-form'
import { Search } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/global/components/Form'
import { Input } from '@/global/components/Input'
import useArtists from "@/modules/artists/hooks/useArtists";
import useGenres from "@/modules/genres/hooks/useGenres";

function VinylBasicForm() {
  const { control, watch, setValue } = useFormContext();
  const { artists } = useArtists();
  const { genres } = useGenres();

  const artistId = watch("artistId");
  const [artistSearch, setArtistSearch] = useState("");
  const [showArtistOptions, setShowArtistOptions] = useState(false);

  const genreValue = watch("genre");
  const [showGenreOptions, setShowGenreOptions] = useState(false);

  // Sincroniza el texto mostrado con el artista ya seleccionado (p.ej. al editar un vinilo existente)
  useEffect(() => {
    if (!artistId) {
      setArtistSearch("");
      return;
    }
    const selected = artists.find((a) => a._id === artistId);
    if (selected) setArtistSearch(selected.name);
  }, [artistId, artists]);

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(artistSearch.toLowerCase())
  );

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes((genreValue || "").toLowerCase())
  );

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

      <div className="relative">
        <FormLabel className="text-xs font-bold uppercase text-slate-500">Artista</FormLabel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={artistSearch}
            onChange={(e) => {
              setArtistSearch(e.target.value);
              setValue("artistId", "", { shouldDirty: true });
              setShowArtistOptions(true);
            }}
            onFocus={() => setShowArtistOptions(true)}
            placeholder="Buscar artista..."
            className="rounded-xl border-slate-200 focus-visible:ring-[#4A6163] pl-9"
          />
        </div>

        {showArtistOptions && artistSearch && !artistId && (
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-lg shadow-lg">
            {filteredArtists.length === 0 && (
              <p className="p-2 text-xs text-gray-400">Sin resultados</p>
            )}
            {filteredArtists.map((a) => (
              <div
                key={a._id}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setValue("artistId", a._id, { shouldDirty: true });
                  setArtistSearch(a.name);
                  setShowArtistOptions(false);
                }}
              >
                {a.name} <span className="text-xs text-gray-400">— {(a.genre || []).join(", ")}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <FormLabel className="text-xs font-bold uppercase text-slate-500">Género</FormLabel>
        <Input
          value={genreValue || ""}
          onChange={(e) => {
            setValue("genre", e.target.value, { shouldDirty: true });
            setShowGenreOptions(true);
          }}
          onFocus={() => setShowGenreOptions(true)}
          onBlur={() => setTimeout(() => setShowGenreOptions(false), 150)}
          placeholder="Buscar o escribir un género..."
          className="rounded-xl border-slate-200 focus-visible:ring-[#4A6163]"
        />

        {showGenreOptions && filteredGenres.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-lg shadow-lg">
            {filteredGenres.map((g) => (
              <div
                key={g._id}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  setValue("genre", g.name, { shouldDirty: true });
                  setShowGenreOptions(false);
                }}
              >
                {g.name}
              </div>
            ))}
          </div>
        )}
      </div>

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
