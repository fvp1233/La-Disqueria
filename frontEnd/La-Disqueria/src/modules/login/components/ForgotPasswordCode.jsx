import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthBrand } from "./AuthBrand";
import { AuthLayout } from "./AuthLayout";

export function ForgotPasswordCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: verificar código con el backend
    navigate("/recuperar-contrasena/nueva");
  };

  return (
    <AuthLayout>
      <AuthBrand subtitle="Recupera tu cuenta" />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
            Código
          </label>
          <input
            type="text"
            placeholder="12123423123213"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#ede8e0] border-none rounded text-sm text-[#444] outline-none focus:ring-2 focus:ring-[#E8602A]/30 placeholder:text-[#aaa] tracking-widest transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#E8602A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#cf4e1e] transition-colors mt-1"
        >
          Recuperar contraseña
        </button>

        <p className="text-center text-[11px] text-[#888]">
          Introduce el código
        </p>
      </div>
    </AuthLayout>
  );
}