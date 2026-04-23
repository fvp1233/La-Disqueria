import { NavLink } from "react-router-dom";

export default function Navbar() {
    //Hacemos constantes que definen el estado si esta seleccionado o no
  const base = "px-4 py-1 rounded-full cursor-pointer";
  const active = "bg-[#FA9598] text-white";
  const inactive = "text-[#54555A]";

  return (
    <div className="w-full flex justify-center mt-4 sticky top-0 z-50">
      <nav className="bg-[#F9FAF4] shadow-md rounded-xl px-6 py-3 flex gap-6 items-center">

        <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Inicio
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Órdenes
        </NavLink>

        <NavLink to="/inventory" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Inventario
        </NavLink>

        <NavLink to="/discs" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Discos
        </NavLink>

        <NavLink to="/accesories" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Accesorios
        </NavLink>

        <NavLink to="/providers" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          Proveedores
        </NavLink>

      </nav>
    </div>
  );
}