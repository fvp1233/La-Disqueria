"use client";

// Hooks de React
import { useState, useEffect } from "react";

// Componentes reutilizables
import { Input } from "@/global/components/Input";
import { Label } from "@/global/components/Label";
import { Button } from "@/global/components/button";
import { FormDropdown } from "@/global/components/FormDropdown";

// Hook con el GET/POST/PUT/DELETE reales de clientes
import useCustomers from "../hooks/useCustomers";

export function CustomerForm({
  onClose,
  onSuccess,
  customer,
  mode = "edit",
}) {

  const { saveCustomer, submitting, error } = useCustomers();

  // Controla si el formulario está en modo vista o edición
  const [internalMode, setInternalMode] = useState(mode);

  // Sincroniza el modo interno cuando cambia la prop mode
  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  // Determina si los campos deben estar bloqueados
  const isReadOnly = internalMode === "view";

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Dirección
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  // Contraseña
  const [password, setPassword] = useState("");

  // Estado del cliente (Activo/Inactivo)
  const [status, setStatus] = useState("Activo");

  // Carga los datos cuando se selecciona un cliente para editar/ver
  useEffect(() => {

    // Si no hay cliente seleccionado, limpia el formulario
    if (!customer) {
      setName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setStreet("");
      setCity("");
      setPassword("");
      setStatus("Activo");
      return;
    }

    // Carga la información del cliente en los inputs
    setName(customer.name || "");
    setLastName(customer.last_name || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");

    // Obtiene la primera dirección registrada
    setStreet(customer.addresses?.[0]?.street || "");
    setCity(customer.addresses?.[0]?.city || "");

    // Convierte boolean a texto para el dropdown
    setStatus(customer.is_active ? "Activo" : "Inactivo");

  }, [customer]);

  // Opciones del dropdown de estado
  const statusOptions = [
    {
      label: "Activo",
      value: "Activo",
    },
    {
      label: "Inactivo",
      value: "Inactivo",
    },
  ];

  // Guardar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Objeto base que se enviará al backend
    const customerData = {
      name,
      last_name: lastName,
      email,
      phone,

      addresses: [
        {
          street,
          city,
        },
      ],

      is_active: status === "Activo",
    };

    // Solo agrega contraseña si el usuario escribió una
    if (password.trim()) {
      customerData.password = password;
    }

    const success = await saveCustomer(customer?._id || null, customerData);

    // Cierra el modal y refresca la tabla al finalizar
    if (success) onSuccess();
  };

  return (
    <>
    {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">

        {/* Nombre */}
        <div>
          <Label>Nombre</Label>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        {/* Apellido */}
        <div>
          <Label>Apellido</Label>

          <Input
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            disabled={isReadOnly}
          />
        </div>

        {/* Correo */}
        <div>
          <Label>Correo</Label>

          <Input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={isReadOnly}
          />
        </div>

        {/* Teléfono */}
        <div>
          <Label>Teléfono</Label>

          <Input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            disabled={isReadOnly}
          />
        </div>

        {/* Calle */}
        <div>
          <Label>Calle</Label>

          <Input
            value={street}
            onChange={(e) =>
              setStreet(e.target.value)
            }
            disabled={isReadOnly}
          />
        </div>

        {/* Ciudad */}
        <div>
          <Label>Ciudad</Label>

          <Input
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            disabled={isReadOnly}
          />
        </div>

        {/* Contraseña */}
        <div className="col-span-2">
          <Label>Contraseña</Label>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        {/* Estado */}
        <div className="col-span-2">
          <Label>Estado</Label>

          <FormDropdown
            options={statusOptions}
            value={status}
            onChange={setStatus}
            disabled={isReadOnly}
          />
        </div>

      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-4 mb-2">

        {/* Cancelar / Cerrar */}
        <Button
          type="button"
          variant="cancel"
          onClick={onClose}
        >
          {isReadOnly ? "Cerrar" : "Cancelar"}
        </Button>

        {/* Botón para pasar de vista a edición */}
        {isReadOnly && (
          <Button
            type="button"
            variant="cd"
            onClick={() =>
              setInternalMode("edit")
            }
          >
            Editar
          </Button>
        )}

        {/* Guardar cambios */}
        {!isReadOnly && (
          <Button type="submit" variant="cd" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        )}

      </div>
    </form>
    </>
  );
}