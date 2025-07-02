import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const AdminLayout = ({ user, onLogout, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 grid md:grid-cols-[16rem_1fr] relative">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Contenido principal */}
      <div className="flex flex-col overflow-y-auto">
        {/* Header móvil */}
        {!menuOpen && (
          <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow z-30 sticky top-0">
            <h1 className="text-lg font-bold text-red-600">Panel de Administración</h1>
            <button onClick={() => setMenuOpen(true)}>
              <FaBars size={22} />
            </button>
          </div>
        )}

        <main className="flex-1 min-h-screen p-6">
          <div className="w-full max-w-4xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
