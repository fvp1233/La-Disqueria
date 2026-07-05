"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Button } from "@/global/components/button"
import { FormDropdown } from "@/global/components/FormDropdown"
import useEmployees from "@/modules/employees/hooks/useEmployees"

export function EmployeeForm({ onClose, onSuccess, employee, mode = "edit" }) {
  const [internalMode, setInternalMode] = useState(mode)
  const isReadOnly = internalMode === "view"

  const { saveEmployee, submitting, error } = useEmployees()

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      position: "",
      hire_date: "",
      is_active: "true",
    },
  })

  const isActive = watch("is_active")

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  useEffect(() => {
    if (!employee) {
      reset({
        name: "",
        last_name: "",
        email: "",
        password: "",
        position: "",
        hire_date: "",
        is_active: "true",
      })
      return
    }
    reset({
      name: employee.name || "",
      last_name: employee.last_name || "",
      email: employee.email || "",
      password: "",
      position: employee.position || "",
      hire_date: employee.hire_date ? employee.hire_date.substring(0, 10) : "",
      is_active: employee.is_active === false ? "false" : "true",
    })
  }, [employee, reset])

  const statusOptions = [
    { label: "Activo", value: "true" },
    { label: "Inactivo", value: "false" },
  ]

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      position: data.position,
      hire_date: data.hire_date,
    }

    if (data.password.trim()) {
      payload.password = data.password
    }

    if (employee) {
      payload.is_active = data.is_active === "true"
    }

    const success = await saveEmployee(employee?._id || null, payload)
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
        <div className="grid grid-cols-2 gap-4">

          <div>
            <Label>Nombre</Label>
            <Input
              {...register("name", { required: "El nombre es requerido" })}
              disabled={isReadOnly}
              className={inputClass(errors.name)}
            />
            {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
          </div>

          <div>
            <Label>Apellido</Label>
            <Input
              {...register("last_name", { required: "El apellido es requerido" })}
              disabled={isReadOnly}
              className={inputClass(errors.last_name)}
            />
            {errors.last_name && <span className="text-xs text-red-400">{errors.last_name.message}</span>}
          </div>

          <div>
            <Label>Correo</Label>
            <Input
              type="email"
              {...register("email", {
                required: "El correo es requerido",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "El correo no es válido" },
              })}
              disabled={isReadOnly}
              className={inputClass(errors.email)}
            />
            {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
          </div>

          <div>
            <Label>Posición</Label>
            <Input
              {...register("position", { required: "La posición es requerida" })}
              disabled={isReadOnly}
              className={inputClass(errors.position)}
            />
            {errors.position && <span className="text-xs text-red-400">{errors.position.message}</span>}
          </div>

          <div>
            <Label>Fecha de contratación</Label>
            <Input
              type="date"
              {...register("hire_date", { required: "La fecha de contratación es requerida" })}
              disabled={isReadOnly}
              className={inputClass(errors.hire_date)}
            />
            {errors.hire_date && <span className="text-xs text-red-400">{errors.hire_date.message}</span>}
          </div>

          <div>
            <Label>{employee ? "Nueva contraseña" : "Contraseña"}</Label>
            <Input
              type="password"
              {...register("password", { required: employee ? false : "La contraseña es requerida" })}
              disabled={isReadOnly}
              placeholder={employee ? "Dejar en blanco para no cambiar" : ""}
              className={inputClass(errors.password)}
            />
            {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
          </div>

          {employee && (
            <div className="col-span-2">
              <Label>Estado</Label>
              <FormDropdown
                options={statusOptions}
                value={isActive}
                onChange={(value) => setValue("is_active", value)}
                disabled={isReadOnly}
              />
            </div>
          )}

        </div>

        <div className="flex justify-end gap-3 mt-4 mb-2">
          <Button type="button" variant="cancel" onClick={onClose}>{isReadOnly ? "Cerrar" : "Cancelar"}</Button>
          {isReadOnly && <Button type="button" onClick={() => setInternalMode("edit")} variant="cd">Editar</Button>}
          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : employee ? "Actualizar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </>
  )
}
