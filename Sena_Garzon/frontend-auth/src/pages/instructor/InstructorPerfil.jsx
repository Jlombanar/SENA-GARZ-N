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
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="text-center py-12">
          <span className="text-6xl">⚠️</span>
          <p className="text-gray-500 text-lg">No se pudieron cargar los datos del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">Mi Perfil</h1>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✏️ Editar
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  💾 Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ❌ Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Información del perfil */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header del perfil */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.nombre || "Instructor"}</h2>
                <p className="text-green-100">{user.email || user.correo}</p>
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mt-2">
                  {user.rol || "instructor"}
                </span>
              </div>
            </div>
          </div>

          {/* Formulario de datos */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {user.nombre || "No especificado"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {user.email || user.correo || "No especificado"}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+57 300 123 4567"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {user.telefono || "No especificado"}
                  </p>
                )}
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎓 Especialidad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu área de especialización"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {user.especialidad || "No especificado"}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Dirección
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu dirección completa"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {user.direccion || "No especificado"}
                  </p>
                )}
              </div>

              {/* Experiencia */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💼 Experiencia Profesional
                </label>
                {isEditing ? (
                  <textarea
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe tu experiencia profesional, años de experiencia, logros importantes..."
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                    {user.experiencia || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <p className="p-2 bg-green-50 text-green-700 rounded-lg font-medium">
                    {user.rol || "instructor"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro</label>
                  <p className="p-2 bg-gray-50 rounded-lg text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPerfil;
