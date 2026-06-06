import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthBrand } from "./AuthBrand";
import { AuthLayout } from "./AuthLayout";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: conectar con el backend
    navigate("/");
  };

  return (
    <AuthLayout>
      <AuthBrand subtitle="Iniciar Sesión" />

      {/* Formulario */}
      <div className="flex flex-col gap-3">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#555] uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#ede8e0] border-none rounded text-sm text-[#444] outline-none focus:ring-2 focus:ring-[#E8602A]/30 placeholder:text-[#aaa] transition"
          />
        </div>

        {/* Contraseña */}
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
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                  <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Recordarme + olvidé */}
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="w-3.5 h-3.5 accent-[#E8602A]"
            />
            <span className="text-[11px] text-[#666]">Recordarme</span>
          </label>
          <Link
            to="/recuperar-contrasena"
            className="text-[11px] text-[#888] hover:text-[#E8602A] transition-colors"
          >
            Olvidé mi contraseña
          </Link>
        </div>

        {/* Botón Iniciar sesión */}
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#E8602A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#cf4e1e] transition-colors mt-1"
        >
          Iniciar sesión
        </button>

        {/* Separador */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#ccc]" />
          <span className="text-[11px] text-[#aaa]">ó</span>
          <div className="flex-1 h-px bg-[#ccc]" />
        </div>

        {/* Google */}
        <button className="w-full py-2.5 bg-white border border-[#ddd] rounded text-[12px] text-[#444] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="#4285F4" />
          </svg>
          Iniciar sesión con Google
        </button>

        {/* Registro */}
        <p className="text-center text-[11px] text-[#888] mt-1">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro" className="text-[#E8602A] font-semibold hover:underline">
            regístrate ahora
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}