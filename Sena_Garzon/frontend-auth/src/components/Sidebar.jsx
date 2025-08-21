import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaChartBar,
  FaDashcube,
  FaSignOutAlt,
  FaHome,
  FaUsers
} from "react-icons/fa";

const Sidebar = ({ user: propUser, onLogout, menuOpen, setMenuOpen }) => {
  const [user, setUser] = useState(propUser || null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!propUser) {
      try {
        const raw = localStorage.getItem("user");
        const storedUser = raw ? JSON.parse(raw) : null;
        if (storedUser) setUser(storedUser);
      } catch (_) {
        setUser(null);
      }
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  const isAdmin = user?.rol === "admin";
  const isInstructor = user?.rol === "instructor";
  const isUser = user?.rol === "user" || user?.rol === "aprendiz";

  // Opciones originales que funcionaban antes
  const adminItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/admin" },
    { name: "Usuarios", icon: <FaUser />, path: "/admin/users" },
    { name: "Cursos", icon: <FaBox />, path: "/admin/cursos" },
    { name: "Instructores", icon: <FaUser />, path: "/admin/instructores" }
    // Reportes se integra al dashboard
  ];

  const instructorItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/instructor" },
    { name: "Mis Cursos", icon: <FaBox />, path: "/instructor/cursos" },
    { name: "Perfil", icon: <FaUser />, path: "/instructor/perfil" },
  ];

  const userItems = [
    { name: "Bienvenidos", icon: <FaDashcube />, path: "/dashboard" },
    { name: "Mis Curso", icon: <FaBox />, path: "/dashboard/miscurso" },
    { name: "Perfil", icon: <FaUser />, path: "/dashboard/profile" },
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
        className={`fixed md:sticky md:top-0 z-20 md:z-auto h-screen md:h-[calc(100vh-0px)] transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        } ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(false)}
      >
        <div className="h-full bg-white text-black border-r border-gray-200 flex flex-col shadow-xl overflow-auto">
          {/* Header del sidebar */}
          <div className="p-4 border-b border-gray-200 bg-green-700 text-white">
            <div className="flex justify-between items-center">
              {!isCollapsed && <h1 className="text-xl font-bold">SENA Panel</h1>}
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden text-white hover:text-green-200"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="p-4 flex items-center gap-3 border-b border-gray-200">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-green-600" />
            ) : (
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            {!isCollapsed && (
              <div>
                <p className="text-sm text-gray-300">Bienvenido,</p>
                <p className="font-semibold truncate max-w-[140px] text-white">{user?.nombre || "Usuario"}</p>
                <span className="text-xs bg-white text-green-700 rounded-full px-2 py-0.5 capitalize font-medium">
                  {user?.rol || "usuario"}
                </span>
              </div>
            )}
          </div>

          {/* Navegación principal */}
          <nav className="flex-1 px-2 space-y-1 py-4">
            {/* Enlace de inicio */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-green-50 hover:text-green-700 ${
                location.pathname === "/" ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <FaHome className="w-5 h-5" />
              {!isCollapsed && <span>Inicio</span>}
            </Link>

            {/* Elementos del menú según el rol */}
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-green-50 hover:text-green-700 ${
                  location.pathname === item.path ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
                } ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                <span className="text-green-600">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isCollapsed 
                  ? "bg-red-100 hover:bg-red-200 text-red-700" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <FaSignOutAlt className="w-4 h-4" />
              {!isCollapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
