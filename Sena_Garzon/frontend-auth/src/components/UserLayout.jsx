// src/components/UserLayout.jsx
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { getStoredUser, touchActivity } from "../utils/storage";

const UserLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser || (storedUser.rol !== "user" && storedUser.rol !== "aprendiz")) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Registrar actividad dentro del layout para mantener la sesión viva hasta el límite
  useEffect(() => {
    const onAct = () => touchActivity();
    window.addEventListener('click', onAct);
    window.addEventListener('keydown', onAct);
    window.addEventListener('mousemove', onAct);
    window.addEventListener('scroll', onAct);
    return () => {
      window.removeEventListener('click', onAct);
      window.removeEventListener('keydown', onAct);
      window.removeEventListener('mousemove', onAct);
      window.removeEventListener('scroll', onAct);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 grid md:grid-cols-[16rem_1fr] relative">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Contenido principal */}
      <div className="flex flex-col overflow-y-auto">
        {/* Header móvil */}
        {!menuOpen && (
          <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow z-30 sticky top-0">
            <h1 className="text-lg font-bold text-green-600">Panel del Usuario</h1>
            <button onClick={() => setMenuOpen(true)}>
              <FaBars size={22} />
            </button>
          </div>
        )}

        <main className="flex-1 min-h-screen p-6">
          <div className="w-full max-w-6xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
