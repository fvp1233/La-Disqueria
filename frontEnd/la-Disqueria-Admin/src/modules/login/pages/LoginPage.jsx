"use client";

import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#F5F5F2] flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

                <h1 className="text-3xl font-bold text-[#334647] mb-6 text-center">
                    La Disquería
                </h1>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        className="input w-full"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input w-full"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#4A6163] text-white py-2 rounded-lg"
                    >Iniciar sesión</button>
                </form>

            </div>
        </div>
    );
}