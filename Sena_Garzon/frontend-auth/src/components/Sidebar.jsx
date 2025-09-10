import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaDashcube,
  FaSignOutAlt,
  FaHome,
  FaGraduationCap,
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

  const adminItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/admin" },
    { name: "Usuarios", icon: <FaUser />, path: "/admin/users" },
    { name: "Cursos", icon: <FaBox />, path: "/admin/cursos" },
    { name: "Instructores", icon: <FaUser />, path: "/admin/instructores" },
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

  const menuItems = isAdmin
    ? adminItems
    : isInstructor
    ? instructorItems
    : isUser
    ? userItems
    : [];

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed md:sticky md:top-0 z-20 h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        } ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(false)}
      >
        <div className="h-full bg-[#3BA900] text-white flex flex-col shadow-2xl border-r border-green-700/40">
          {/* Header */}
          <div className="p-5 border-b border-green-700 bg-[#007832] text-white shadow-md">
            <div className="flex justify-between items-center">
              {!isCollapsed && (
                <h1 className="text-2xl font-serif font-bold tracking-wide flex items-center gap-2">
                  <FaGraduationCap className="text-white" /> SENA
                </h1>
              )}
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={22} />
              </button>
            </div>
          </div>

          {/* Usuario */}
          <div className="p-5 flex items-center gap-4 border-b border-green-600 bg-white text-green-900">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#3BA900] shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-[#007832] text-white rounded-full flex items-center justify-center font-bold shadow-md">
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs text-green-700 font-medium italic">Bienvenido,</p>
                <p className="font-semibold truncate max-w-[160px] text-green-900 text-lg">
                  {user?.nombre || "Usuario"}
                </p>
                <span className="text-xs bg-[#3BA900] text-white rounded-full px-3 py-1 capitalize font-medium mt-1 inline-block shadow-sm">
                  {user?.rol || "usuario"}
                </span>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-3 space-y-2 py-6 bg-white">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${
                location.pathname === "/"
                  ? "bg-[#3BA900] text-white font-bold"
                  : "text-green-900 hover:bg-[#007832] hover:text-white"
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <FaHome className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium tracking-wide">Inicio</span>}
            </Link>

            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${
                  location.pathname === item.path
                    ? "bg-[#3BA900] text-white font-bold"
                    : "text-green-900 hover:bg-[#007832] hover:text-white"
                } ${isCollapsed ? "justify-center" : "gap-3"}`}
              >
                {item.icon}
                {!isCollapsed && <span className="font-medium tracking-wide">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-5 border-t border-green-600 bg-[#007832]">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-xl bg-white text-green-900 hover:bg-green-100 transition-all flex items-center justify-center gap-2 font-medium tracking-wide shadow-md"
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

