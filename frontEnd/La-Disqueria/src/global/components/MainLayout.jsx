import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* El Outlet es donde se renderizarán las páginas de los módulos */}
        <Outlet />
      </main>
    </>
  );
}