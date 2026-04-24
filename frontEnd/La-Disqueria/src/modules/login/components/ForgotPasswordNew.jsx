import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthBrand } from "./AuthBrand";
import { AuthLayout } from "./AuthLayout";

const CRITERIA = [
  "Contener un mínimo de 8 caracteres.",
  "Incluir al menos una letra mayúscula (A-Z).",
  "Incluir al menos una letra minúscula (a-z).",
  "Contener al menos un número (0-9).",
  "Incluir al menos un carácter especial (por ejemplo: ! @ # $ % ^ & *).",
];

export function ForgotPasswordNew() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: enviar nueva contraseña al backend
    navigate("/login");
  };

  return (
    <AuthLayout>
      <AuthBrand subtitle="Recupera tu cuenta" />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
            Crea tu nueva contraseña
          </label>
          <input
            type="password"
            placeholder="dsaldfsaldfsdf"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#ede8e0] border-none rounded text-sm text-[#444] outline-none focus:ring-2 focus:ring-[#E8602A]/30 placeholder:text-[#aaa] transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#E8602A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#cf4e1e] transition-colors"
        >
          Actualizar
        </button>

        {/* Criterios de contraseña */}
        <div className="mt-3 text-[11px] text-[#555] leading-relaxed">
          <p className="mb-2">
            Con el fin de garantizar la seguridad toda contraseña debe cumplir obligatoriamente con los siguientes criterios:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {CRITERIA.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </AuthLayout>
  );
}