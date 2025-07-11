import { FaUser, FaEnvelope, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaEdit, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { useState } from "react";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    correo: user?.correo || ""
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderRolIcon = () => {
    switch(user?.rol) {
      case "admin":
        return <FaUserShield className="text-3xl text-[#007832]" />;
      case "instructor":
        return <FaChalkboardTeacher className="text-3xl text-[#1A6C37]" />;
      case "usuario":
        return <FaUserGraduate className="text-3xl text-[#3BA900]" />;
      default:
        return <FaUser className="text-3xl text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f0] to-[#d0e6d0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Tarjeta principal del perfil */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-l-8 border-[#3BA900] transition-all duration-300 hover:shadow-lg">
          {/* Encabezado con fondo degradado */}
          <div className="bg-gradient-to-r from-[#007832] to-[#3BA900] p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mi Perfil</h1>
              <div className="flex space-x-3">
                <button 
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center transition-all duration-200"
                >
                  <FaEdit className="mr-2" />
                  {isEditing ? "Cancelar" : "Editar"}
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center transition-all duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sección izquierda - Avatar e información básica */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#3BA900] shadow-md">
                    {renderRolIcon()}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#007832] text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                    {user?.rol}
                  </div>
                </div>

                {!isEditing ? (
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">{user?.nombre}</h2>
                    <p className="text-gray-600 flex items-center justify-center">
                      <FaEnvelope className="mr-2 text-[#3BA900]" />
                      {user?.correo}
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BA900] focus:border-[#3BA900]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BA900] focus:border-[#3BA900]"
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full bg-[#3BA900] hover:bg-[#2f8c00] text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>

              {/* Sección derecha - Historial de actividades */}
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaHistory className="mr-2 text-[#1A6C37]" />
                  Historial Reciente
                </h3>
                
                <div className="bg-[#f8faf8] p-4 rounded-xl border border-[#e0e8e0] hover:border-[#3BA900] transition duration-200 mb-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-[#3BA900]/10 p-2 rounded-full mr-3">
                      <FaHistory className="text-[#3BA900]" />
                    </div>
                    <h4 className="font-medium text-gray-800">Últimas actividades</h4>
                  </div>
                  <p className="text-sm text-gray-600">Aquí aparecerán tus interacciones recientes con la plataforma</p>
                </div>

                {/* Estadísticas básicas */}
                <div className="bg-[#f0f7f0] p-5 rounded-xl border border-[#d0e6d0]">
                  <h4 className="font-semibold text-[#007832] mb-3">Tu actividad</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sesión activa</span>
                        <span>Ahora</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#3BA900] h-2.5 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;