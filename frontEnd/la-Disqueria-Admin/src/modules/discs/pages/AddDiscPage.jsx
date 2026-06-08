import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useDataVinyls from "@/modules/discs/hooks/useDataVinyls";
import { Form } from "@/global/components/Form"; 
import VinylImageForm from "../components/VinylImageForm";
import VinylBasicForm from "../components/VinylForm";
import VinylSpecsForm from "../components/VinylSpecsForm";
import VinylTracklistForm from "../components/VinylTrackListForm";

function AgregarDisco() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") || "vinilos";

  // Traemos solo la función de guardar y los estados de envío de la API
  const { saveVinyl, submitting, error, message } = useDataVinyls();

  // Inicialización limpia de React Hook Form con los valores vacíos por defecto
  const methods = useForm({
    defaultValues: {
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
    },
  });

  // Manejo de la redirección automática una vez que la API confirma el éxito
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        navigate(`/discs?tipo=${tipo}`);
      }, 1500);
    }
  }, [message, navigate, tipo]);

  const onSubmit = async (data) => {
    console.log(data , 'datos del formulario')
    
    const success = await saveVinyl(null, data);
    if (success) {
      methods.reset(); // Limpia los inputs del formulario tras guardar con éxito
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#334647] mb-6">
          Agregar {tipo === "cds" ? "CD" : "Vinilo"}
        </h1>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium">{error}</div>}
        {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl text-sm font-medium">{message}</div>}

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-md p-8 space-y-8">
            
            <VinylImageForm />
            <VinylBasicForm />
            <VinylSpecsForm />
            <VinylTracklistForm />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                disabled={submitting}
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#4A6163] text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {submitting ? "Guardando..." : "Guardar Disco"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AgregarDisco;