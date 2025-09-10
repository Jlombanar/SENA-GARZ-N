import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const InstructorPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    especialidad: "",
    direccion: "",
    experiencia: ""
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(storedUser);
      setFormData({
        nombre: storedUser.nombre || "",
        email: storedUser.email || storedUser.correo || "",
        telefono: storedUser.telefono || "",
        especialidad: storedUser.especialidad || "",
        direccion: storedUser.direccion || "",
        experiencia: storedUser.experiencia || ""
      });
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Simular guardado
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    toast.success("Perfil actualizado exitosamente");
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || "",
      email: user?.email || user?.correo || "",
      telefono: user?.telefono || "",
      especialidad: user?.especialidad || "",
      direccion: user?.direccion || "",
      experiencia: user?.experiencia || ""
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Cargando perfil</h3>
          <p className="text-gray-500">Espere un momento por favor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-6xl mb-4 text-green-500">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar datos</h3>
          <p className="text-gray-500">No se pudieron cargar los datos del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Mi Perfil</h1>
            <p className="text-green-600 mt-1">Gestiona tu información personal y profesional</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
              >
                <span>✏️</span> Editar Perfil
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span>💾</span> Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-white text-green-700 border border-green-600 px-5 py-2.5 rounded-xl hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
                >
                  <span>❌</span> Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tarjeta de perfil */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header con gradiente verde */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mr-0 md:mr-6 mb-4 md:mb-0 shadow-lg">
                <span className="text-4xl">👤</span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold">{user.nombre || "Instructor"}</h2>
                <p className="text-green-100 mt-1">{user.email || user.correo}</p>
                <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mt-3">
                  {user.rol ? user.rol.toUpperCase() : "INSTRUCTOR"}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2 flex items-center">
                  <span className="mr-2 text-green-600">👤</span> Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg text-gray-900 border border-green-100">
                    {user.nombre || "No especificado"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2 flex items-center">
                  <span className="mr-2 text-green-600">📧</span> Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg text-gray-900 border border-green-100">
                    {user.email || user.correo || "No especificado"}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2 flex items-center">
                  <span className="mr-2 text-green-600">📞</span> Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="+57 300 123 4567"
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg text-gray-900 border border-green-100">
                    {user.telefono || "No especificado"}
                  </p>
                )}
              </div>

              {/* Especialidad */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2 flex items-center">
                  <span className="mr-2 text-green-600">🎓</span> Especialidad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Tu área de especialización"
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg text-gray-900 border border-green-100">
                    {user.especialidad || "No especificado"}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2 bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2 flex items-center">
                  <span className="mr-2 text-green-600">📍</span> Dirección
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Tu dirección completa"
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg text-gray-900 border border-green-100">
                    {user.direccion || "No especificado"}
                  </p>
                )}
              </div>

              {/* Experiencia */}
              <div className="md:col-span-2 bg-green-50 p-4 rounded-xl border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2 flex items-center">
                  <span className="mr-2 text-green-600">💼</span> Experiencia Profesional
                </label>
                {isEditing ? (
                  <textarea
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Describe tu experiencia profesional, años de experiencia, logros importantes..."
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg text-gray-900 border border-green-100 min-h-[120px]">
                    {user.experiencia || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-10 pt-8 border-t border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3 text-green-600">📋</span>
                Información de la Cuenta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <label className="block text-sm font-medium text-green-800 mb-2">Rol en el Sistema</label>
                  <p className="p-3 bg-white text-green-700 font-medium rounded-lg border border-green-200">
                    {user.rol || "instructor"}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <label className="block text-sm font-medium text-green-800 mb-2">Fecha de Registro</label>
                  <p className="p-3 bg-white text-green-700 rounded-lg border border-green-200">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : "No disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nota al pie */}
        <div className="mt-8 text-center text-green-600 text-sm">
          <p>© {new Date().getFullYear()} Sistema de Instructores. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorPerfil;