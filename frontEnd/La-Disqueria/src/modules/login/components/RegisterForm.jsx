import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthBrand } from "./AuthBrand";
import { AuthLayout } from "./AuthLayout";
import useRegisterCustomer from "@/modules/login/hooks/useRegisterCustomer";

export function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerCustomer, verifyCode, submitting, error } = useRegisterCustomer();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "verify"
  const [code, setCode] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await registerCustomer({
      name: form.nombre,
      last_name: form.apellido,
      phone: form.numero,
      email: form.email,
      password: form.password,
    });

    if (success) setStep("verify");
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const success = await verifyCode(code);
    if (success) navigate("/login", { state: { from: location.state?.from } });
  };

  const fields = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Correo electrónico" },
    { name: "apellido", label: "Apellido", type: "text", placeholder: "Correo electrónico" },
    { name: "numero", label: "Número", type: "tel", placeholder: "+" },
    { name: "email", label: "Email", type: "email", placeholder: "Correo electrónico" },
  ];

  if (step === "verify") {
    return (
      <AuthLayout>
        <AuthBrand subtitle="Verifica tu correo" />

        <form className="flex flex-col gap-3" onSubmit={handleVerify}>
          {error && (
            <p className="text-center text-[11px] text-red-500 bg-red-50 rounded py-2 px-3">{error}</p>
          )}

          <p className="text-center text-[11px] text-[#888]">
            Enviamos un código de verificación a {form.email}
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
              Código
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código de verificación"
              className="w-full px-4 py-2.5 bg-[#ede8e0] border-none rounded text-sm text-[#444] outline-none focus:ring-2 focus:ring-[#E8602A]/30 placeholder:text-[#aaa] tracking-widest transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#E8602A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#cf4e1e] transition-colors mt-1 disabled:opacity-60"
          >
            {submitting ? "Verificando..." : "Verificar cuenta"}
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthBrand subtitle="Crear Usuario" />

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {error && (
          <p className="text-center text-[11px] text-red-500 bg-red-50 rounded py-2 px-3">{error}</p>
        )}

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
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-[#E8602A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#cf4e1e] transition-colors mt-2 disabled:opacity-60"
        >
          {submitting ? "Creando..." : "Crear"}
        </button>

        <p className="text-center text-[11px] text-[#888] mt-1">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#E8602A] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}