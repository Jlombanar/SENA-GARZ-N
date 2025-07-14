import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBook, FaUserEdit, FaPlusCircle } from "react-icons/fa";

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "instructor") {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="w-full px-6 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Bienvenido, {user.nombre}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Tarjeta Mis Cursos */}
        <Link
          to="/instructor/cursos"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border-l-4 border-green-600"
        >
          <div className="flex items-center gap-4">
            <FaBook className="text-green-600 text-4xl" />
            <div>
              <h2 className="text-lg font-bold text-gray-700">Mis Cursos</h2>
              <p className="text-gray-500 text-sm">Gestiona los cursos que has creado</p>
            </div>
          </div>
        </Link>

        {/* Tarjeta Perfil */}
        <Link
          to="/instructor/perfil"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border-l-4 border-green-600"
        >
          <div className="flex items-center gap-4">
            <FaUserEdit className="text-green-600 text-4xl" />
            <div>
              <h2 className="text-lg font-bold text-gray-700">Mi Perfil</h2>
              <p className="text-gray-500 text-sm">Revisa y edita tu información personal</p>
            </div>
          </div>
        </Link>

        {/* Tarjeta Crear Curso */}
        <Link
          to="/instructor/cursos?crear=true"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border-l-4 border-green-600"
        >
          <div className="flex items-center gap-4">
            <FaPlusCircle className="text-green-600 text-4xl" />
            <div>
              <h2 className="text-lg font-bold text-gray-700">Nuevo Curso</h2>
              <p className="text-gray-500 text-sm">Crea un curso desde cero</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <p className="text-gray-600 text-sm italic">
          Recuerda mantener tus cursos actualizados para los aprendices.
        </p>
      </div>
    </div>
  );
};

export default InstructorDashboard;
