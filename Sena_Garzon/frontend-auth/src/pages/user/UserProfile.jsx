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
                return <FaUserShield className="text-4xl text-green-700 animate-pulse" />;
            case "instructor":
                return <FaChalkboardTeacher className="text-4xl text-green-600 animate-pulse" />;
            case "usuario":
            case "aprendiz":
                return <FaUserGraduate className="text-4xl text-green-500 animate-pulse" />;
            default:
                return <FaUser className="text-4xl text-green-400" />;
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-green-200 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-green-200 transform transition-transform duration-500 hover:scale-[1.01] relative z-10">
                    {/* Header con gradiente brillante */}
                    <div className="bg-gradient-to-r from-green-500 to-green-700 p-8 text-white relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between z-10 relative">
                            <h1 className="text-4xl font-bold mb-4 sm:mb-0">Mi Perfil</h1>
                            <div className="flex space-x-3">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="relative group overflow-hidden px-6 py-3 rounded-full flex items-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-green-500 font-semibold"
                                        >
                                            <div className="absolute inset-0 bg-white opacity-90 transition-opacity duration-300 group-hover:opacity-100 group-active:scale-95"></div>
                                            <FaSave className="mr-2 relative z-10 text-green-800" />
                                            <span className="relative z-10 text-green-800">{loading ? "Guardando..." : "Guardar"}</span>
                                        </button>
                                        <button 
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="relative group overflow-hidden px-6 py-3 rounded-full flex items-center transition-all duration-300 transform hover:scale-105 text-green-500 font-semibold"
                                        >
                                            <div className="absolute inset-0 bg-white opacity-90 transition-opacity duration-300 group-hover:opacity-100 group-active:scale-95"></div>
                                            <FaTimes className="mr-2 relative z-10 text-green-800" />
                                            <span className="relative z-10 text-green-800">Cancelar</span>
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleEdit}
                                        className="relative group overflow-hidden px-6 py-3 rounded-full flex items-center transition-all duration-300 transform hover:scale-105 text-white font-semibold"
                                    >
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-30 group-active:scale-95"></div>
                                        <FaEdit className="mr-2 relative z-10 text-white" />
                                        <span className="relative z-10 text-white">Editar</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido del perfil */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Sección izquierda - Avatar e información básica */}
                        <div className="flex flex-col items-center col-span-1 border-r-2 border-green-100 pr-8">
                            <div className="relative mb-6">
                                <div className="w-40 h-40 rounded-full bg-green-100 overflow-hidden flex items-center justify-center border-4 border-green-500 shadow-xl transform transition-transform duration-300 hover:scale-110">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                    ) : renderRolIcon()}
                                </div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md animate-pulse-slow">
                                    {user?.rol}
                                </div>
                            </div>

                            {!isEditing ? (
                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-bold text-green-950">{user?.nombre}</h2>
                                    <p className="text-green-800 flex items-center justify-center font-medium text-lg">
                                        <FaEnvelope className="mr-2 text-green-600" />
                                        {user?.correo}
                                    </p>
                                    <p className="text-gray-600">
                                        📞 {user.telefono || "No especificado"}
                                    </p>
                                    <p className="text-gray-600">
                                        📍 {user.direccion || "No especificado"}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full space-y-5">
                                    {/* Campos de formulario */}
                                    <div className="relative">
                                        <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-green-700">Nombre *</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-green-700">Correo *</label>
                                        <input
                                            type="email"
                                            name="correo"
                                            value={formData.correo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-green-700">Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-green-700">Dirección</label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">Foto de perfil</label>
                                        <input type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files?.[0]||null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-colors" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sección derecha - Información de la cuenta y estado */}
                        <div className="col-span-1 lg:col-span-2">
                            <h3 className="text-2xl font-semibold text-green-900 mb-6 flex items-center">
                                <FaHistory className="mr-3 text-green-700" />
                                Información de la Cuenta
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Detalles de la cuenta */}
                                <div className="bg-green-50 p-6 rounded-3xl border border-green-200 transition duration-300 hover:shadow-lg hover:border-green-500">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-green-300 p-3 rounded-full mr-3 transform rotate-45 group-hover:rotate-0 transition-transform">
                                            <FaUser className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform" />
                                        </div>
                                        <h4 className="font-semibold text-green-800">Detalles de la cuenta</h4>
                                    </div>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <p><strong>Rol:</strong> {user.rol}</p>
                                        <p><strong>Fecha de registro:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Estadísticas básicas */}
                                <div className="bg-green-50 p-6 rounded-3xl border border-green-200 transition duration-300 hover:shadow-lg hover:border-green-500">
                                    <h4 className="font-semibold text-green-800 mb-3">Estado de la cuenta</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Estado</span>
                                                <span className="text-green-600 font-medium">Activo</span>
                                            </div>
                                            <div className="w-full bg-green-200 rounded-full h-2.5 overflow-hidden">
                                                <div className="bg-green-500 h-2.5 rounded-full w-full animate-progress-full"></div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <p className="flex items-center"><span className="text-green-500 mr-2">✅</span>Cuenta verificada</p>
                                            <p className="flex items-center"><span className="text-green-500 mr-2">✅</span>Acceso completo a la plataforma</p>
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