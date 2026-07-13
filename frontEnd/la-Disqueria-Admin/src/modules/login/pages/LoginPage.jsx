"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { notifySuccess, notifyError } from "@/global/lib/notifications";

function CornerWaves({ className }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <g fill="none" stroke="#F2B6AC" strokeWidth="2">
        <path opacity="0.9" d="M-80,20 Q-30,-30 20,20 T120,20 T220,20 T320,20 T420,20" />
        <path opacity="0.8" d="M-80,60 Q-30,10 20,60 T120,60 T220,60 T320,60 T420,60" />
        <path opacity="0.75" d="M-80,100 Q-30,50 20,100 T120,100 T220,100 T320,100 T420,100" />
        <path opacity="0.65" d="M-80,140 Q-30,90 20,140 T120,140 T220,140 T320,140 T420,140" />
        <path opacity="0.55" d="M-80,180 Q-30,130 20,180 T120,180 T220,180 T320,180 T420,180" />
        <path opacity="0.45" d="M-80,220 Q-30,170 20,220 T120,220 T220,220 T320,220 T420,220" />
        <path opacity="0.35" d="M-80,260 Q-30,210 20,260 T120,260 T220,260 T320,260 T420,260" />
        <path opacity="0.25" d="M-80,300 Q-30,250 20,300 T120,300 T220,300 T320,300 T420,300" />
      </g>
    </svg>
  );
}

// Traduce los mensajes que devuelve el backend para mostrarlos en español
const errorMessages = {
  "Email and password are required.": "El correo y la contraseña son requeridos",
  "User not found": "Usuario no encontrado",
  "User is locked": "Cuenta bloqueada por intentos fallidos. Intenta de nuevo en 15 minutos",
  "Wrong password": "Contraseña incorrecta",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      notifySuccess(`Bienvenido/a, ${user.name || "administrador"}`);
      navigate("/dashboard");
    } catch (error) {
      const message = error?.message || "Credenciales incorrectas. Por favor, intenta de nuevo.";
      notifyError(errorMessages[message] || message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F1] relative overflow-hidden flex items-center justify-center px-4">
      <CornerWaves className="pointer-events-none select-none absolute -top-16 -left-16 w-72 h-72 md:w-96 md:h-96 rotate-[-15deg]" />
      <CornerWaves className="pointer-events-none select-none absolute -bottom-16 -right-16 w-72 h-72 md:w-96 md:h-96 rotate-[165deg]" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <img src={logo} alt="La Disquería" className="w-28 h-28 object-contain mb-4" />

        <h1 className="text-4xl font-bold text-[#F2954B] mb-2">La disqueria</h1>

        <p className="text-xs tracking-widest text-gray-500 uppercase mb-6">Inciar sesión</p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4" noValidate>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange("email")}
              disabled={isLoading}
              className="w-full h-10 rounded-md bg-gray-100 px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#F2954B]/40"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange("password")}
                disabled={isLoading}
                className="w-full h-10 rounded-md bg-gray-100 px-3 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#F2954B]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300" />
              Recordarme
            </label>

            <a href="#" className="text-gray-500 hover:text-gray-700">
              Olvide mi contraseña
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-lg bg-[#F0603F] text-white font-medium hover:bg-[#e0552f] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
