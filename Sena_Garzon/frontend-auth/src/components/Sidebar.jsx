import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaChartBar,
  FaCog,
  FaDashcube,
} from "react-icons/fa";

const Sidebar = ({ user: propUser, onLogout, menuOpen, setMenuOpen }) => {
  const [user, setUser] = useState(propUser || null);

  // Sincroniza con localStorage en caso de recarga o delay de props
  useEffect(() => {
    if (!propUser) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  const isAdmin = user?.rol === "admin";

  const adminItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/dashboard" },
    { name: "Usuarios", icon: <FaUser />, path: "/admin/usuarios" },
    { name: "Productos", icon: <FaBox />, path: "/admin/productos" },
  ];

  const userItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/dashboard" },
    { name: "Perfil", icon: <FaUser />, path: "/perfil" },
    { name: "Pedidos", icon: <FaBox />, path: "/pedidos" },
  ];

  const menuItems = isAdmin ? adminItems : userItems;

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-white/60 via-blue-100/40 to-transparent backdrop-blur-sm z-10 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`bg-white w-64 shadow-lg fixed md:relative z-20 transition-transform duration-300 md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:block flex flex-col justify-between min-h-screen`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600">Panel</h2>
            <button className="md:hidden" onClick={() => setMenuOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>

          <div className="text-gray-600 mb-6">
            <p className="font-medium">Bienvenido,</p>
            <p className="font-semibold">{user?.nombre || "Usuario"}</p>
            <p className="text-sm text-gray-500 italic capitalize">
              {user?.rol || "usuario"}
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors"
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
                className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
