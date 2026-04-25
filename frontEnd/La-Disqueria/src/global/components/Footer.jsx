import { Link } from "react-router-dom";

export function Footer() {
  const links = [
    { label: "Términos", to: "/" },
    { label: "Privacidad", to: "/" },
    { label: "Nosotros", to: "/about" },
  ];

  return (
    <footer className="w-full bg-[#3a3f3f] px-6 md:px-10 py-5 flex flex-col md:flex-row items-center gap-4 md:gap-0 md:justify-between">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#F2EFE7] flex items-center justify-center">
          <svg viewBox="0 0 14 14" className="w-3.5 h-3.5">
            <circle cx="7" cy="7" r="6" fill="none" stroke="#3a3f3f" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="2" fill="#3a3f3f" />
          </svg>
        </div>
        <span className="text-[#F2EFE7] text-sm font-medium tracking-wide">
          La disquería
        </span>
      </div>

      {/* Copyright */}
      <span className="text-[#a0a8a8] text-xs tracking-wide text-center">
        © 2023 La disquería. Todos los derechos reservados.
      </span>

      {/* Links */}
      <div className="flex gap-5 md:gap-7">
        {links.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="text-[#c8d0d0] hover:text-[#F2EFE7] text-xs tracking-wide transition-colors duration-150"
          >
            {label}
          </Link>
        ))}
      </div>

    </footer>
  );
}