import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-200 text-center px-4">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-6">
        Lo sentimos, la ruta que estás buscando no existe.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
