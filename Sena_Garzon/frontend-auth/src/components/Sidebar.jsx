import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaChartBar,
  FaDashcube,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ user: propUser, onLogout, menuOpen, setMenuOpen }) => {
  const [user, setUser] = useState(propUser || null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

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
    { name: "Dashboard", icon: <FaDashcube />, path: "/admin", color: "green" },
    { name: "Usuarios", icon: <FaUser />, path: "/admin/usuarios", color: "green" },
    { name: "Cursos", icon: <FaBox />, path: "/admin/curso", color: "green" },
    { name: "Instructores", icon: <FaUser />, path: "/admin/instructores", color: "green" },
    { name: "Reportes", icon: <FaChartBar />, path: "/admin/reportes", color: "green" },
  ];

  const instructorItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/instructor", color: "green" },
    { name: "Mis Cursos", icon: <FaBox />, path: "/instructor/cursos", color: "green" },
    { name: "Perfil", icon: <FaUser />, path: "/instructor/perfil", color: "green" },
  ];

  const userItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/dashboard", color: "green" },
    { name: "Mis Cursos", icon: <FaBox />, path: "/dashboard/miscurso", color: "green" },
    { name: "Perfil", icon: <FaUser />, path: "/dashboard/perfil", color: "green" },
  ];

  const menuItems = isAdmin ? adminItems : isInstructor ? instructorItems : isUser ? userItems : [];

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-lg z-10 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-20 h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        } ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="h-full bg-white text-black border-r border-gray-200 flex flex-col shadow-xl">
          <div className="p-4 border-b border-gray-200 bg-green-700 text-white">
            <div className="flex justify-between items-center">
              {!isCollapsed && <h1 className="text-xl font-bold">SENA</h1>}
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
              {user?.nombre?.charAt(0) || "U"}
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm">Bienvenido</p>
                <p className="font-semibold truncate max-w-[140px]">{user?.nombre || "Usuario"}</p>
                <span className="text-xs bg-black text-white rounded-full px-2 py-0.5 capitalize">
                  {user?.rol || "usuario"}
                </span>
              </div>
            )}
          </div>

          <nav className="flex-1 px-2 space-y-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center p-2 rounded-md transition-all duration-200 hover:bg-green-100 ${
                location.pathname === "/" ? "bg-green-200 font-semibold" : ""
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.75L12 4.5l9 5.25M4.5 10.5v8.25A1.5 1.5 0 006 20.25h4.5v-6h3v6H18a1.5 1.5 0 001.5-1.5V10.5"
                />
              </svg>
              {!isCollapsed && <span>Inicio</span>}
            </Link>

            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center p-2 rounded-md transition-all duration-200 hover:bg-green-100 ${
                  location.pathname === item.path ? "bg-green-200 font-semibold" : ""
                } ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <span className="text-green-800">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className={`w-full py-2 rounded-md transition flex items-center justify-center gap-2 ${
                isCollapsed ? "bg-white hover:bg-gray-100 text-black" : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              <FaSignOutAlt className={`${isCollapsed ? "text-black" : "text-white"}`} />
              {!isCollapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
