import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown, Search, X, Menu } from "lucide-react";
import logoDisqueria from '@/assets/logo.png';
import { cn } from '@/global/lib/utils'

import { Button } from "@/global/components/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/global/components/navigation-menu";

export function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="sticky top-0 z-50">
                <style>{`
                    [data-slot="navigation-menu-viewport-wrapper"] { position: absolute !important; }
                    [data-slot="navigation-menu-content"], 
                    .navigation-menu-popup, 
                    [data-slot="navigation-menu-trigger"][data-popup-open] {
                        background-color: #4A5D5E !important;
                    }
                `}</style>

                <nav className="flex items-center justify-between p-4 border-b bg-[#F9FAF4] px-6 xl:px-18 font-['Plus_Jakarta_Sans']">

                    {/*Menu Móvil y Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="xl:hidden p-2 text-slate-900"
                        >
                            <Menu className="size-6" />
                        </button>

                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white p-3 rounded-full flex items-center justify-center">
                                <img src={logoDisqueria} alt="logo" className="size-6 object-contain" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 hidden sm:block">La Disqueria</span>
                        </Link>
                    </div>

                    {/* Seccion de menús de Escritorio y Carrito */}
                    <div className="flex items-center gap-6">

                        {/* navegacion ne desktop (Solo visible en pantallas XL) */}
                        <div className="hidden xl:block">
                            <NavigationMenu>
                                <NavigationMenuList>

                                    {/* PRODUCTOS */}
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle(), "data-popup-open:text-white data-popup-open:bg-[#4A5D5E]")}>
                                            <Link to="/products">Productos</Link>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-[#4A5D5E]">
                                            <div className="w-212.5 p-10 text-white rounded-b-xl ">
                                                <div className="relative mb-10">
                                                    <input type="text" placeholder="BUSCAR PRODUCTOS..." className="w-full bg-transparent border border-white/40 rounded-none py-3 px-2 text-xs tracking-widest placeholder:text-white/50 focus:outline-none focus:border-white transition-all uppercase" />
                                                    <Search className="absolute right-2 top-3 size-4 text-white/60" />
                                                </div>
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

                                    {/* ARTISTAS */}
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger asChild className={cn(navigationMenuTriggerStyle(), "data-popup-open:text-white data-popup-open:bg-[#4A5D5E]")}>
                                            <Link to="/artists">Artistas</Link>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-[#4A5D5E]">
                                            <div className="w-212.5 p-10 text-white rounded-b-xl">
                                                <div className="relative mb-10">
                                                    <input type="text" placeholder="BUSCAR ARTISTAS..." className="w-full bg-transparent border border-white/40 rounded-none py-3 px-2 text-xs tracking-widest placeholder:text-white/50 focus:outline-none focus:border-white transition-all uppercase" />
                                                    <Search className="absolute right-2 top-3 size-4 text-white/60" />
                                                </div>
                                                <h4 className="font-bold border-b border-white/20 pb-3 mb-8 uppercase tracking-[0.2em] text-[10px] opacity-60">Nuestros Artistas</h4>
                                                <div className="grid grid-cols-3 gap-x-12 text-[13px] font-medium">
                                                    <ul>{["Amy Winehouse", "Beyonce", "Billie Eilish", "Blink-182", "Bob Marley", "Def Leppard", "Elton John", "Fall Out Boy"].map(a => <li key={a} className="mb-3 hover:opacity-60"><Link to="/">{a}</Link></li>)}</ul>
                                                    <ul>{["Kendrick Lamar", "KISS", "Lady Gaga", "Lana Del Rey", "Led Zeppelin", "Marvin Gaye", "Metallica", "Nirvana"].map(a => <li key={a} className="mb-3 hover:opacity-60"><Link to="/">{a}</Link></li>)}</ul>
                                                    <ul>{["Soundgarden", "Tame Impala", "Taylor Swift", "The Beatles", "The Rolling Stones", "The Weeknd", "The Who", "U2"].map(a => <li key={a} className="mb-3 hover:opacity-60"><Link to="/">{a}</Link></li>)}</ul>
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    {/* CATEGORÍAS*/}
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger asChild className={cn(navigationMenuTriggerStyle(), "data-popup-open:text-white data-popup-open:bg-[#4A5D5E]")}>
                                            <Link to="/categorias">Categorías</Link>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-[#4A5D5E]">
                                            <div className="w-212.5 p-10 text-white rounded-b-xl">
                                                <div className="relative mb-10">
                                                    <input type="text" placeholder="BUSCAR EN CATEGORÍAS..." className="w-full bg-transparent border border-white/40 rounded-none py-3 px-2 text-xs tracking-widest placeholder:text-white/50 focus:outline-none focus:border-white transition-all uppercase" />
                                                    <Search className="absolute right-2 top-3 size-4 text-white/60" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-12">
                                                    <div>
                                                        <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Géneros Musicales</h4>
                                                        <ul className="space-y-3 text-[13px] font-medium">
                                                            {["Alternative & Indie Rock", "Classic Pop & Vocal", "Classic Rock", "Country & Folk", "Electronic & Dance", "Funk, Soul & Reggae", "Hip-Hop & R&B", "Holiday", "Jazz & Blues", "Punk, Metal & Hard Rock", "Pop & Alt Pop", "Soundtracks"].map(item => (
                                                                <li key={item} className="hover:opacity-60 transition-opacity">
                                                                    <Link to={`/inventario?genero=${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Formatos</h4>
                                                        <ul className="space-y-3 text-[13px] font-medium">
                                                            {["Box Sets", "Color Vinyl", "Half Speed Masters", "Heavyweight", "Picture Discs", "1LP", "2LP", "7 inch"].map(item => (
                                                                <li key={item} className="hover:opacity-60 transition-opacity">
                                                                    <Link to={`/inventario?formato=${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold border-b border-white/20 pb-3 mb-5 uppercase tracking-[0.2em] text-[10px] opacity-60">Tipos de Edición</h4>
                                                        <ul className="space-y-3 text-[13px] font-medium">
                                                            {["Exclusives", "Limited Edition", "Greatest Hits", "Compilaciones", "Apparel & Accessories", "Vinyl Accessories"].map(item => (
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
                        </div>

                        {/* Botón Iniciar sesión (oculto en mobile) */}
                        <Button asChild variant="default" className="hidden md:flex gap-2 rounded-full px-8 bg-slate-950 hover:bg-slate-800 text-white mt-0.5">
                            <Link to="/login">Iniciar sesión</Link>
                        </Button>

                        {/* Icono de Carrito */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 rounded-full hover:bg-slate-100 relative text-slate-700 transition-colors"
                        >
                            <ShoppingCart className="size-6" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/*Sidebar de movil */}
            <div className={cn("fixed inset-0 bg-black/60 z-[120] backdrop-blur-sm transition-all xl:hidden", isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible")} onClick={() => setIsMobileMenuOpen(false)} />
            <div className={cn("fixed top-0 left-0 h-full w-[300px] bg-white z-[130] transition-transform duration-300 xl:hidden", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
                <div className="p-8 flex flex-col gap-8 font-['Plus_Jakarta_Sans'] h-full overflow-y-auto">
                    <div className="flex justify-between items-center border-b pb-4">
                        <span className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Navegación</span>
                        <X className="size-6" onClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                    <nav className="flex flex-col gap-6 text-xl font-bold text-slate-900">
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
                        <Link to="/artists" onClick={() => setIsMobileMenuOpen(false)}>Artistas</Link>
                        <Link to="/categorias" onClick={() => setIsMobileMenuOpen(false)}>Categorías</Link>
                        <hr className="my-2 border-slate-100" />
                        <Link to="/login" className="text-sm uppercase tracking-widest text-slate-500" onClick={() => setIsMobileMenuOpen(false)}>Mi Cuenta / Login</Link>
                    </nav>
                </div>
            </div>

            {/* Sidebar de carrito*/}
            <div className={cn("fixed inset-0 bg-black/40 z-[140] backdrop-blur-sm transition-all", isCartOpen ? "opacity-100 visible" : "opacity-0 invisible")} onClick={() => setIsCartOpen(false)} />
            <div className={cn("fixed top-0 right-0 h-full w-full max-w-md bg-black text-white z-[150] transition-transform duration-300 border-l border-white/10 shadow-2xl", isCartOpen ? "translate-x-0" : "translate-x-full")}>
                <div className="flex flex-col h-full font-['Plus_Jakarta_Sans']">
                    <div className="p-8 flex justify-between items-center border-b border-white/10 bg-black/40">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="size-5 text-white/40" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em]">Carrito de Compras</h2>
                        </div>
                        <X className="size-6 cursor-pointer hover:text-white/60 transition-colors" onClick={() => setIsCartOpen(false)} />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="bg-white/5 p-6 rounded-full mb-4">
                            <ShoppingCart className="size-12 text-white/5" />
                        </div>
                        <p className="text-sm font-light text-white/40 tracking-widest uppercase">Tu bolsa está vacía</p>
                    </div>
                    <div className="p-8 border-t border-white/10 bg-black/60">
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Subtotal</span>
                            <span className="text-2xl font-bold">$0.00</span>
                        </div>
                        <Button className="w-full bg-[#4A5D5E] hover:bg-[#3d4d4e] py-8 rounded-none uppercase text-[11px] font-bold tracking-[0.2em] transition-all">
                            Tramitar Pedido
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}