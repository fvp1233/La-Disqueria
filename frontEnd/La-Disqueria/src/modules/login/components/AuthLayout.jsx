/**
 * AuthLayout
 * Wrapper compartido para todas las páginas de autenticación.
 * Reproduce el fondo crema con líneas topográficas rojo-naranja del diseño.
 */
export function AuthLayout({ children }) {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: "#f5f0ea" }}
        >
            {/* ── Líneas topográficas: esquina superior izquierda (rojo) ── */}
            <svg
                className="absolute top-0 left-0 w-[320px] pointer-events-none"
                viewBox="0 0 320 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {[0, 14, 28, 42, 56, 70, 84, 98].map((offset, i) => (
                    <path
                        key={i}
                        d={`M${-20 + offset} 10 C${40 + offset} 30, ${60 + offset} 80, ${20 + offset} 120 C${-10 + offset} 160, ${50 + offset} 200, ${80 + offset} 240 C${110 + offset} 280, ${130 + offset} 300, ${160 + offset} 280`}
                        stroke={i % 2 === 0 ? "#E8602A" : "#F47E6A"}
                        strokeWidth="1.2"
                        opacity={0.5 - i * 0.04}
                    />
                ))}
            </svg>

            {/* ── Líneas topográficas: esquina inferior izquierda (naranja) ── */}
            <svg
                className="absolute bottom-0 left-0 w-[280px] pointer-events-none"
                viewBox="0 0 280 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {[0, 14, 28, 42, 56, 70, 84].map((offset, i) => (
                    <path
                        key={i}
                        d={`M${-20 + offset} 260 C${50 + offset} 220, ${30 + offset} 160, ${70 + offset} 120 C${110 + offset} 80, ${80 + offset} 40, ${140 + offset} 10`}
                        stroke="#F0A070"
                        strokeWidth="1.2"
                        opacity={0.5 - i * 0.05}
                    />
                ))}
            </svg>

            {/* ── Líneas topográficas: esquina superior derecha (naranja claro) ── */}
            <svg
                className="absolute top-0 right-0 w-[300px] pointer-events-none"
                viewBox="0 0 300 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {[0, 14, 28, 42, 56, 70, 84].map((offset, i) => (
                    <path
                        key={i}
                        d={`M${320 - offset} 10 C${260 - offset} 50, ${280 - offset} 110, ${240 - offset} 150 C${200 - offset} 190, ${230 - offset} 230, ${200 - offset} 260`}
                        stroke="#F0A070"
                        strokeWidth="1.2"
                        opacity={0.45 - i * 0.04}
                    />
                ))}
            </svg>

            {/* ── Líneas topográficas: esquina inferior derecha (rojo) ── */}
            <svg
                className="absolute bottom-0 right-0 w-[280px] pointer-events-none"
                viewBox="0 0 280 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {[0, 14, 28, 42, 56, 70].map((offset, i) => (
                    <path
                        key={i}
                        d={`M${300 - offset} 260 C${240 - offset} 200, ${260 - offset} 140, ${220 - offset} 100 C${180 - offset} 60, ${200 - offset} 20, ${170 - offset} -10`}
                        stroke="#E8602A"
                        strokeWidth="1.2"
                        opacity={0.4 - i * 0.04}
                    />
                ))}
            </svg>

            {/* ── Contenido central ── */}
            <div className="relative z-10 w-full max-w-md px-6">
                {children}
            </div>
        </div>
    );
}