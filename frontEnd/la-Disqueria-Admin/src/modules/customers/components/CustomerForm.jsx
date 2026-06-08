"use client";

import { useState, useEffect } from "react";

import { Input } from "@/global/components/Input";
import { Label } from "@/global/components/Label";
import { Button } from "@/global/components/button";
import { FormDropdown } from "@/global/components/FormDropdown";

import {
  createCustomer,
  updateCustomer,
} from "../services/CustomerService";

export function CustomerForm({
  onClose,
  customer,
  mode = "edit",
}) {
  const [internalMode, setInternalMode] = useState(mode);

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  const isReadOnly = internalMode === "view";

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("Activo");

  useEffect(() => {
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

    setName(customer.name || "");
    setLastName(customer.last_name || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");

    setStreet(customer.addresses?.[0]?.street || "");
    setCity(customer.addresses?.[0]?.city || "");

    setStatus(customer.is_active ? "Activo" : "Inactivo");
  }, [customer]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      if (password.trim()) {
        customerData.password = password;
      }

      // Crear
      if (!customer) {
        customerData.password = password;

        await createCustomer(customerData);
      }

      // Editar
      else {
        await updateCustomer(
          customer._id,
          customerData
        );
      }

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nombre</Label>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isReadOnly}
          />
        </div>

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

        <div className="col-span-2">
          <Label>Contraseña</Label>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isReadOnly}
          />
        </div>

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

      <div className="flex justify-end gap-3 mt-4 mb-2">
        <Button
          type="button"
          variant="cancel"
          onClick={onClose}
        >
          {isReadOnly ? "Cerrar" : "Cancelar"}
        </Button>

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

        {!isReadOnly && (
          <Button type="submit" variant="cd">
            Guardar
          </Button>
        )}
      </div>
    </form>
  );
}