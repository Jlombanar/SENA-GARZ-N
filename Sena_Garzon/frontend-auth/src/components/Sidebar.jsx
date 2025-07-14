import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaChartBar,
  FaDashcube,
} from "react-icons/fa";

const Sidebar = ({ user: propUser, onLogout, menuOpen, setMenuOpen }) => {
  const [user, setUser] = useState(propUser || null);

  useEffect(() => {
    if (!propUser) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  const isAdmin = user?.rol === "admin";
  const isInstructor = user?.rol === "instructor";
  const isUser = user?.rol === "user" || user?.rol === "aprendiz";

  const adminItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/admin" },
    { name: "Usuarios", icon: <FaUser />, path: "/admin/usuarios" },
    { name: "Curso", icon: <FaBox />, path: "/admin/curso" },
    { name: "Instructores", icon: <FaUser />, path: "/admin/instructores" },
    { name: "Reportes", icon: <FaChartBar />, path: "/admin/reportes" },
  ];

  const instructorItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/instructor" },
    { name: "Cursos", icon: <FaBox />, path: "/instructor/cursos" },
    { name: "Perfil", icon: <FaUser />, path: "/instructor/perfil" },
  ];

  const userItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/dashboard" },
    { name: "Mis Cursos", icon: <FaBox />, path: "/dashboard/miscurso" },
    { name: "Perfil", icon: <FaUser />, path: "/dashboard/perfil" },
  ];

  const menuItems = isAdmin
    ? adminItems
    : isInstructor
    ? instructorItems
    : isUser
    ? userItems
    : [];

  return (
    <>
      {/* Fondo oscuro al abrir menú en móvil */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`bg-white w-64 fixed md:static z-20 h-screen shadow-lg transition-transform duration-300 border-r border-green-200
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Encabezado */}
        <div className="p-4 border-b border-green-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-green-700">SENA Panel</h2>
            <button
              className="md:hidden text-green-700"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="mt-4 text-gray-600">
            <p className="font-medium">Bienvenido,</p>
            <p className="font-semibold text-gray-900">{user?.nombre || "Usuario"}</p>
            <p className="text-sm text-gray-500 italic capitalize">
              {user?.rol || "usuario"}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="p-4 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9.75L12 4.5l9 5.25M4.5 10.5v8.25A1.5 1.5 0 006 20.25h4.5v-6h3v6H18a1.5 1.5 0 001.5-1.5V10.5"
              />
            </svg>
            Inicio
          </Link>

          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition-colors"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Botón cerrar sesión */}
        <div className="p-4 mt-auto">
          <button
            onClick={onLogout}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 w-full"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
