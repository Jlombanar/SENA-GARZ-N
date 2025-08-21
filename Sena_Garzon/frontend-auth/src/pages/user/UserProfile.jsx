import { FaUser, FaEnvelope, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaEdit, FaSignOutAlt, FaHistory, FaSave, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const storedUser = raw ? JSON.parse(raw) : null;
      if (storedUser) {
        setUser(storedUser);
        setFormData({
          nombre: storedUser.nombre || "",
          correo: storedUser.correo || "",
          telefono: storedUser.telefono || "",
          direccion: storedUser.direccion || ""
        });
      }
    } catch (_) {}
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [avatarFile, setAvatarFile] = useState(null);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // actualizar datos básicos
      const response = await axios.put(
        `http://localhost:5000/api/auth/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      let updatedUser = response.data.user || response.data;

      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const avatarRes = await axios.put(
          `http://localhost:5000/api/auth/users/profile`,
          fd,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatedUser = avatarRes.data.user || avatarRes.data;
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error(error.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || "",
      correo: user?.correo || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || ""
    });
    setIsEditing(false);
  };

  const renderRolIcon = () => {
    switch(user?.rol) {
      case "admin":
        return <FaUserShield className="text-3xl text-[#007832]" />;
      case "instructor":
        return <FaChalkboardTeacher className="text-3xl text-[#1A6C37]" />;
      case "usuario":
      case "aprendiz":
        return <FaUserGraduate className="text-3xl text-[#3BA900]" />;
      default:
        return <FaUser className="text-3xl text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f7f0] to-[#d0e6d0] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mi Perfil</h1>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center transition-all duration-200 disabled:opacity-50"
                    >
                      <FaSave className="mr-2" />
                      {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={loading}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center transition-all duration-200"
                    >
                      <FaTimes className="mr-2" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEdit}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center transition-all duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sección izquierda - Avatar e información básica */}
              <div className="flex flex-col items-center w-full md:w-1/3">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-[#3BA900] shadow-md">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : renderRolIcon()}
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
                    {user?.telefono && (
                      <p className="text-gray-600 text-sm">
                        📞 {user.telefono}
                      </p>
                    )}
                    {user?.direccion && (
                      <p className="text-gray-600 text-sm">
                        📍 {user.direccion}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BA900] focus:border-[#3BA900]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BA900] focus:border-[#3BA900]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BA900] focus:border-[#3BA900]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BA900] focus:border-[#3BA900]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Foto de perfil</label>
                      <input type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files?.[0]||null)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                )}
              </div>

              {/* Sección derecha - Historial de actividades */}
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaHistory className="mr-2 text-[#1A6C37]" />
                  Información de la Cuenta
                </h3>
                
                <div className="bg-[#f8faf8] p-4 rounded-xl border border-[#e0e8e0] hover:border-[#3BA900] transition duration-200 mb-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-[#3BA900]/10 p-2 rounded-full mr-3">
                      <FaUser className="text-[#3BA900]" />
                    </div>
                    <h4 className="font-medium text-gray-800">Detalles de la cuenta</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>ID de Usuario:</strong> {user._id}</p>
                    <p><strong>Rol:</strong> {user.rol}</p>
                    <p><strong>Fecha de registro:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Estadísticas básicas */}
                <div className="bg-[#f0f7f0] p-5 rounded-xl border border-[#d0e6d0]">
                  <h4 className="font-semibold text-[#007832] mb-3">Estado de la cuenta</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Estado</span>
                        <span className="text-green-600 font-medium">Activo</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#3BA900] h-2.5 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>✅ Cuenta verificada</p>
                      <p>✅ Acceso completo a la plataforma</p>
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