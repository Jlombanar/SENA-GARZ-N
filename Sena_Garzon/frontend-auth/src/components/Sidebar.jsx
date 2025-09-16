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
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const allMenuItems = [{ name: "Inicio", icon: <FaHome />, path: "/" }, ...menuItems];

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed md:sticky md:top-0 z-40 h-screen transition-all duration-300 transform ${
          isCollapsed ? "w-20" : "w-72"
        } ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="h-full bg-white text-gray-900 flex flex-col shadow-2xl shadow-green-100 border-r-8 border-green-500">

          {/* Header - Logo */}
          <div className="p-6 border-b-2 border-green-200">
            <div className="flex justify-between items-center">
              {!isCollapsed && (
                <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl text-green-500">
                  <FaGraduationCap className="text-green-500" />
                  SENA
                </Link>
              )}
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden text-green-700 hover:text-green-900 p-2"
              >
                <FaTimes size={24} />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 flex items-center gap-4 border-b-2 border-green-200">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-4 border-green-500 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md bg-green-500 text-white">
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm text-green-600 font-bold">Bienvenido,</p>
                <p className="font-semibold truncate max-w-[160px] text-green-800 text-lg">
                  {user?.nombre || "Usuario"}
                </p>
                <span className="text-xs bg-green-200 text-green-700 px-3 py-1 capitalize font-medium mt-1 inline-block">
                  {user?.rol || "usuario"}
                </span>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 py-8 space-y-3">
            {allMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center p-4 relative
                  ${
                    location.pathname === item.path
                      ? "bg-green-500 text-white font-bold shadow-md shadow-green-300"
                      : "text-green-600 hover:bg-green-50 font-medium"
                  }
                  ${isCollapsed ? "justify-center" : "gap-4"}
                `}
              >
                <span className={`text-2xl ${location.pathname === item.path ? 'text-white' : 'text-green-500'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="tracking-wide">
                    {item.name}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 w-max px-3 py-1 bg-green-700 text-white text-sm opacity-0 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t-2 border-green-200">
            <button
              onClick={onLogout}
              className="w-full py-4 px-4 bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2 font-bold tracking-wide shadow-md"
            >
              <FaSignOutAlt className="w-5 h-5" />
              {!isCollapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;