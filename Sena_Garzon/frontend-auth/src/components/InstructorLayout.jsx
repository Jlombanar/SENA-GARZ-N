import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const InstructorLayout = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar solo debe ocupar w-64 */}
      <div className="w-64 hidden md:block">
        <Sidebar
          user={user}
          onLogout={onLogout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>

      {/* Sidebar para móviles */}
      <div className="md:hidden">
        <Sidebar
          user={user}
          onLogout={onLogout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;
