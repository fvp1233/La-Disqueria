import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown, Search } from "lucide-react";
import logoDisqueria from '@/assets/logo.png';
import { cn } from '@/global/lib/utils'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/global/components/dropdown-menu";
import { Button } from "@/global/components/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/global/components/navigation-menu";

const menuItems = {
    artistas: [
        { name: "Rock", link: "/artistas/rock" },
        { name: "Pop", link: "/artistas/pop" },
        { name: "Jazz", link: "/artistas/jazz" },
    ],
    categorias: [
        { name: "Novedades", link: "/categorias/novedades" },
        { name: "Ofertas", link: "/categorias/ofertas" },
    ],
};

const NavDropdown = ({ label, items }) => (
    <DropdownMenu>
        <DropdownMenuTrigger className={navigationMenuTriggerStyle()}>
            {label} <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#4A5D5E] text-white border-none">
            {items.map((item) => (
                <DropdownMenuItem key={item.link} asChild
                    className={"focus:bg-[#4A5D5E]! focus:text-black"}>
                    <Link to={item.link} className="w-full">
                        {item.name}
                    </Link>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);

export function Navbar() {
    return (
        <>

            <style>{`
                 [data-slot="navigation-menu-content"],
    [data-slot="navigation-menu-content"] ~ *,
    .navigation-menu-popup,
    [data-popup-open] {
        background-color: #4A5D5E !important;
                }
            `}</style>
            <nav className="flex items-center justify-between p-4 border-b bg-[#F9FAF4] px-18 font-['Plus_Jakarta_Sans']">

                {/* SECCIÓN IZQUIERDA: Logo y Nombre */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white p-3 rounded-full flex items-center justify-center">
                        <img src={logoDisqueria} alt="logo" className="size-6 object-contain" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">La Disqueria</span>
                </Link>

                {/* SECCIÓN DERECHA: Menús, Botón y Carrito */}
                <div className="flex items-center gap-6">

                    <NavigationMenu>
                        <NavigationMenuList>
                            {/*PRODUCTOS */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className={cn(
                                    navigationMenuTriggerStyle(),
                                    "data-popup-open:text-white data-popup-open:bg-[#4A5D5E]"
                                )}>
                                    <Link to="/products">Productos</Link>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-[#4A5D5E]">
                                    <div className="w-212.5 p-10 text-white rounded-b-xl ">
                                        {/* BUSCADOR */}
                                        <div className="relative mb-10">
                                            <input
                                                type="text"
                                                placeholder="BUSCAR PRODUCTOS..."
                                                className="w-full bg-transparent border border-white/40 rounded-none py-3 px-2 text-xs tracking-widest placeholder:text-white/50 focus:outline-none focus:border-white transition-all uppercase"
                                            />
                                            <Search className="absolute right-2 top-3 size-4 text-white/60" />
                                        </div>

                                        {/* 3 COLUMNAS */}
                                        <div className="grid grid-cols-3 gap-12">
                                            <div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Géneros</h4>
                                                <ul className="space-y-3 text-[13px] font-medium">
                                                    {["Alternativo & Rock Indie", "Pop Clasico & Vocal", "Rock Clasico", "Country & Folk", "Electronica", "Funk & Reggae", "Hip-Hop & R&B", "Jazz & Blues", "Punk, Metal & Hard Rock", "Pop & Alt Pop", "Soundtracks"].map(item => (
                                                        <li key={item} className="hover:opacity-60 transition-opacity"><Link to="/">{item}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Formatos</h4>
                                                <ul className="space-y-3 text-[13px] font-medium">
                                                    {["Box Sets", "Vinilos de Color", "Masterizacion de velocidad media", "Pesados", "Discos con foto", "1LP", "2LP", "7 pulgadas"].map(item => (
                                                        <li key={item} className="hover:opacity-60 transition-opacity"><Link to="/">{item}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Tipos</h4>
                                                <ul className="space-y-3 text-[13px] font-medium">
                                                    {["Exclusivos", "Edicion limitada", "Hits", "Compilaciones", "Merch", "Accesorios"].map(item => (
                                                        <li key={item} className="hover:opacity-60 transition-opacity"><Link to="/">{item}</Link></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger asChild className={cn(
                                    navigationMenuTriggerStyle(),
                                    "data-popup-open:text-white data-popup-open:bg-[#4A5D5E]"
                                )}>
                                    <Link to="/artistas">Artistas</Link>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="bg-[#4A5D5E]">
                                    <div className="w-212.5 p-10 text-white rounded-b-xl">
                                        {/* BUSCADOR */}
                                        <div className="relative mb-10">
                                            <input
                                                type="text"
                                                placeholder="BUSCAR ARTISTAS..."
                                                className="w-full bg-transparent border border-white/40 rounded-none py-3 px-2 text-xs tracking-widest placeholder:text-white/50 focus:outline-none focus:border-white transition-all uppercase"
                                            />
                                            <Search className="absolute right-2 top-3 size-4 text-white/60" />
                                        </div>

                                        <h4 className="font-bold border-b border-white/20 pb-3 mb-8 uppercase tracking-[0.2em] text-[10px] opacity-60">Nuestros Artistas</h4>

                                        <div className="grid grid-cols-3 gap-x-12">
                                            {/* Columna 1 */}
                                            <ul className="space-y-3 text-[13px] font-medium">
                                                {["Amy Winehouse", "Beyonce", "Billie Eilish", "Blink-182", "Bob Marley", "Def Leppard", "Elton John", "Fall Out Boy", "Frank Sinatra", "Guns N Roses", "John Coltrane", "Johnny Cash"].map(item => (
                                                    <li key={item} className="hover:opacity-60 transition-opacity"><Link to="/">{item}</Link></li>
                                                ))}
                                            </ul>
                                            {/* Columna 2 */}
                                            <ul className="space-y-3 text-[13px] font-medium">
                                                {["Kendrick Lamar", "KISS", "Lady Gaga", "Lana Del Rey", "Led Zeppelin", "Marvin Gaye", "Metallica", "Nirvana", "No Doubt", "Post Malone", "Rihanna", "Rush"].map(item => (
                                                    <li key={item} className="hover:opacity-60 transition-opacity"><Link to="/">{item}</Link></li>
                                                ))}
                                            </ul>
                                            {/* Columna 3 */}
                                            <ul className="space-y-3 text-[13px] font-medium">
                                                {["Soundgarden", "Tame Impala", "Taylor Swift", "The Beatles", "The Rolling Stones", "The Velvet Underground", "The Weeknd", "The Who", "Tom Petty", "U2", "Weezer", "Yusuf / Cat Stevens"].map(item => (
                                                    <li key={item} className="hover:opacity-60 transition-opacity"><Link to="/">{item}</Link></li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    asChild
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "data-popup-open:text-white data-popup-open:bg-[#4A5D5E]"
                                    )}
                                >
                                    <Link to="/categorias">Categorías</Link>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="bg-[#4A5D5E]">
                                    <div className="w-212.5 p-10 text-white rounded-b-xl">
                                        {/* BUSCADOR */}
                                        <div className="relative mb-10">
                                            <input
                                                type="text"
                                                placeholder="BUSCAR EN CATEGORÍAS..."
                                                className="w-full bg-transparent border border-white/40 rounded-none py-3 px-2 text-xs tracking-widest placeholder:text-white/50 focus:outline-none focus:border-white transition-all uppercase"
                                            />
                                            <Search className="absolute right-2 top-3 size-4 text-white/60" />
                                        </div>

                                        {/* 3 COLUMNAS: GÉNEROS, FORMATOS Y TIPOS */}
                                        <div className="grid grid-cols-3 gap-12">
                                            {/* COLUMNA 1: GÉNEROS */}
                                            <div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Géneros Musicales</h4>
                                                <ul className="space-y-3 text-[13px] font-medium">
                                                    {[
                                                        "Alternative & Indie Rock", "Classic Pop & Vocal", "Classic Rock",
                                                        "Country & Folk", "Electronic & Dance", "Funk, Soul & Reggae",
                                                        "Hip-Hop & R&B", "Holiday", "Jazz & Blues",
                                                        "Punk, Metal & Hard Rock", "Pop & Alt Pop", "Soundtracks"
                                                    ].map(item => (
                                                        <li key={item} className="hover:opacity-60 transition-opacity">
                                                            <Link to={`/inventario?genero=${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* COLUMNA 2: FORMATOS */}
                                            <div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Formatos</h4>
                                                <ul className="space-y-3 text-[13px] font-medium">
                                                    {[
                                                        "Box Sets", "Color Vinyl", "Half Speed Masters",
                                                        "Heavyweight", "Picture Discs", "1LP", "2LP", "7 inch"
                                                    ].map(item => (
                                                        <li key={item} className="hover:opacity-60 transition-opacity">
                                                            <Link to={`/inventario?formato=${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* COLUMNA 3: TIPOS */}
                                            <div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Tipos de Edición</h4>
                                                <ul className="space-y-3 text-[13px] font-medium">
                                                    {[
                                                        "Exclusives", "Limited Edition", "Greatest Hits",
                                                        "Compilaciones", "Apparel & Accessories", "Vinyl Accessories"
                                                    ].map(item => (
                                                        <li key={item} className="hover:opacity-60 transition-opacity">
                                                            <Link to={`/inventario?tipo=${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>



                    {/* Botón Iniciar sesión */}
                    <Button asChild variant="default" className="flex gap-2 rounded-full px-8 bg-slate-950 hover:bg-slate-800 text-white mt-0.5">
                        <Link to="/login">
                            Iniciar sesión
                        </Link>
                    </Button>

                    {/* Icono de Carrito */}
                    <Link to="/carrito" className="p-2 rounded-full hover:bg-slate-100 relative text-slate-700">
                        <ShoppingCart className="size-6" />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                            0
                        </span>
                    </Link>
                </div>
            </nav>
        </>
    );

}