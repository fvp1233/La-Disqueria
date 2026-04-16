import React from 'react';
import homeStyle from '@/modules/login/pages/Login'

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-blue-600">Bienvenido a Nuestra App</h1>
                <p className="mt-4 text-gray-700">Explora las funcionalidades y disfruta de la experiencia.</p>
            </header>
            <main className="mt-8">
                <button className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Ejemplo de navegacion
                </button>
            </main>
        </div>
    );
};

export default Home;