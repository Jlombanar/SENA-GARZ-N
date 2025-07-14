import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSave, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const InstructorPerfil = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    especialidad: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "instructor") {
      navigate("/login");
    } else {
      setUser(storedUser);
      setFormData({
        nombre: storedUser.nombre,
        correo: storedUser.correo,
        telefono: storedUser.telefono || "",
        especialidad: storedUser.especialidad || "",
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData
      );
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success("Perfil actualizado correctamente");
      setEditMode(false);
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-green-200 mt-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div>
          <img
            src={`https://ui-avatars.com/api/?name=${user.nombre}&background=3BA900&color=fff&size=128`}
            alt="Instructor Avatar"
            className="w-32 h-32 rounded-full border-4 border-green-500 shadow-md"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-green-700 mb-1">
            Perfil del Instructor
          </h1>
          <p className="text-gray-600 mb-4">Información personal y de contacto</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700">Nombre:</label>
              {editMode ? (
                <input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              ) : (
                <p className="text-gray-900">{user.nombre}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700">Correo:</label>
              {editMode ? (
                <input
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              ) : (
                <p className="text-gray-900">{user.correo}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700">Teléfono:</label>
              {editMode ? (
                <input
                  name="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              ) : (
                <p className="text-gray-900">
                  {user.telefono || "No definido"}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700">Especialidad:</label>
              {editMode ? (
                <input
                  name="especialidad"
                  type="text"
                  value={formData.especialidad}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md mt-1"
                />
              ) : (
                <p className="text-gray-900">
                  {user.especialidad || "No definida"}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700">Rol:</label>
              <p className="text-gray-900 capitalize">{user.rol}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Fecha de Registro:</label>
              <p className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("es-CO")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-10 text-center">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition mr-4"
            >
              <FaSave />
              Guardar Cambios
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="inline-flex items-center gap-2 bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
            >
              <FaTimesCircle />
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
          >
            <FaUserEdit />
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorPerfil;
