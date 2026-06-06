import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthBrand } from "./AuthBrand";
import { AuthLayout } from "./AuthLayout";

export function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    numero: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: conectar con el backend
    navigate("/login");
  };

  const fields = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Correo electrónico" },
    { name: "apellido", label: "Apellido", type: "text", placeholder: "Correo electrónico" },
    { name: "numero", label: "Número", type: "tel", placeholder: "+" },
    { name: "email", label: "Email", type: "email", placeholder: "Correo electrónico" },
  ];

  return (
    <AuthLayout>
      <AuthBrand subtitle="Crear Usuario" />

      <div className="flex flex-col gap-3">
        {fields.map(({ name, label, type, placeholder }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
              {label}
            </label>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#ede8e0] border-none rounded text-sm text-[#444] outline-none focus:ring-2 focus:ring-[#E8602A]/30 placeholder:text-[#aaa] transition"
            />
          </div>
        ))}

        {/* Contraseña con toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 pr-10 bg-[#ede8e0] border-none rounded text-sm text-[#444] outline-none focus:ring-2 focus:ring-[#E8602A]/30 placeholder:text-[#aaa] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#E8602A] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Botón crear */}
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#E8602A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#cf4e1e] transition-colors mt-2"
        >
          Crear
        </button>

        <p className="text-center text-[11px] text-[#888] mt-1">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#E8602A] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}