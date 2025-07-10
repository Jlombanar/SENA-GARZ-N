// src/components/InstructorLayout.jsx
import { Outlet, Link } from "react-router-dom";

const InstructorLayout = ({ user, onLogout }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-green-700 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-6">Instructor Panel</h2>
        <nav className="space-y-4">
          <Link to="/instructor" className="block">Inicio</Link>
          <Link to="/instructor/cursos" className="block">Mis Cursos</Link>
          <button onClick={onLogout} className="mt-6 bg-white text-green-700 px-4 py-2 rounded">
            Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;
