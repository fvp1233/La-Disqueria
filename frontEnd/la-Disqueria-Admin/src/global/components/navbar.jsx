import { NavLink } from "react-router-dom";

export default function Navbar() {
    //Hacemos constantes que definen el estado si esta seleccionado o no
  const base = "px-4 py-1 rounded-full cursor-pointer";
  const active = "bg-[#FA9598] text-white";
  const inactive = "text-[#54555A]";

  return (
    <div className="w-full flex justify-center mt-4">
      <nav className="bg-[#F9FAF4] shadow-md rounded-xl px-6 py-3 flex gap-6 items-center">

        <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Inicio
        </NavLink>

        <NavLink to="/ordenes" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Ordenes
        </NavLink>

        <NavLink to="/inventario" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Inventario
        </NavLink>

        <NavLink to="/discos" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Discos
        </NavLink>

      </nav>
    </div>
  );
}