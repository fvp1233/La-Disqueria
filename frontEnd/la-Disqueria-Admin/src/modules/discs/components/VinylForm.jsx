import React, { useState } from "react";
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/global/components/Form'
import { Input } from '@/global/components/Input'
import { Button } from '@/global/components/button'
import useArtists from "@/modules/artists/hooks/useArtists";
import useGenres from "@/modules/genres/hooks/useGenres";

function VinylBasicForm() {
  const { control, watch, setValue } = useFormContext();
  const { artists } = useArtists();
  const { genres } = useGenres();

  const artistId = watch("artistId");
  const genreValue = watch("genre");

  const [openArtistModal, setOpenArtistModal] = useState(false);
  const [artistSearch, setArtistSearch] = useState("");

  const [openGenreModal, setOpenGenreModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");

  const selectedArtist = artists.find((a) => a._id === artistId);
  const selectedGenre = genres.find((g) => g.name === genreValue);

  const selectArtist = (artist) => {
    setValue("artistId", artist._id, { shouldDirty: true });
    setOpenArtistModal(false);
  };

  const selectGenre = (genre) => {
    setValue("genre", genre.name, { shouldDirty: true });
    setOpenGenreModal(false);
  };

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(artistSearch.toLowerCase())
  );

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(genreSearch.toLowerCase())
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

      <div>
        <FormLabel className="text-xs font-bold uppercase text-slate-500">Artista</FormLabel>
        <div className="border rounded-lg p-2 h-[74px] flex flex-col gap-1.5 overflow-y-auto">
          {!selectedArtist && (
            <p className="text-xs text-gray-400 text-center mt-2">Sin artista seleccionado</p>
          )}
          {selectedArtist && (
            <div className="flex items-center gap-2 border rounded-md px-2 py-1">
              <p className="flex-1 text-xs font-medium">{selectedArtist.name}</p>
              <button
                type="button"
                onClick={() => setValue("artistId", "", { shouldDirty: true })}
                className="text-red-400 text-xs hover:underline"
              >
                Quitar
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpenArtistModal(true)}
            className="text-xs text-red-400 hover:bg-red-50 border p-1 rounded"
          >
            {selectedArtist ? "Cambiar artista" : "+ Agregar artista"}
          </button>
        </div>
      </div>

      <div>
        <FormLabel className="text-xs font-bold uppercase text-slate-500">Género</FormLabel>
        <div className="border rounded-lg p-2 h-[74px] flex flex-col gap-1.5 overflow-y-auto">
          {!selectedGenre && (
            <p className="text-xs text-gray-400 text-center mt-2">Sin género seleccionado</p>
          )}
          {selectedGenre && (
            <div className="flex items-center gap-2 border rounded-md px-2 py-1">
              <p className="flex-1 text-xs font-medium">{selectedGenre.name}</p>
              <button
                type="button"
                onClick={() => setValue("genre", "", { shouldDirty: true })}
                className="text-red-400 text-xs hover:underline"
              >
                Quitar
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpenGenreModal(true)}
            className="text-xs text-red-400 hover:bg-red-50 border p-1 rounded"
          >
            {selectedGenre ? "Cambiar género" : "+ Agregar género"}
          </button>
        </div>
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

      {/* Modal artistas */}
      {openArtistModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Seleccionar artista</h2>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredArtists.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4">Sin resultados</p>
              )}
              {filteredArtists.map((a) => {
                const isSelected = a._id === artistId;
                return (
                  <div
                    key={a._id}
                    onClick={() => selectArtist(a)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-gray-400">{(a.genre || []).join(", ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{selectedArtist ? "1 artista seleccionado" : "Ningún artista seleccionado"}</span>
              <Button variant="cancel" onClick={() => setOpenArtistModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal géneros */}
      {openGenreModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Seleccionar género</h2>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredGenres.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4">Sin resultados</p>
              )}
              {filteredGenres.map((g) => {
                const isSelected = g.name === genreValue;
                return (
                  <div
                    key={g._id}
                    onClick={() => selectGenre(g)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{g.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{selectedGenre ? "1 género seleccionado" : "Ningún género seleccionado"}</span>
              <Button variant="cancel" onClick={() => setOpenGenreModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VinylBasicForm;
