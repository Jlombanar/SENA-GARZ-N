import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCursos } from "../../services/cursoService";
import { toast } from "react-toastify";

const Miscurso = () => {
  const [cursos, setCursos] = useState([]);
  const [inscripciones, setInscripciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await getCursos(token);
        setCursos(res.data);
      } catch (err) {
        console.error("Error al cargar cursos", err.response?.data || err);
        toast.error("Error al cargar los cursos");
      }
    };

    if (token) {
      fetchCursos();
    } else {
      toast.error("No hay token de autenticación");
    }
  }, [token]);

  const handleChange = (cursoId, field, value) => {
    setInscripciones((prev) => ({
      ...prev,
      [cursoId]: {
        ...prev[cursoId],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (cursoId, file) => {
    if (file && file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF");
      return;
    }
    
    setInscripciones((prev) => ({
      ...prev,
      [cursoId]: {
        ...prev[cursoId],
        file,
      },
    }));
  };

  const toggleForm = (cursoId) => {
    setShowForm(prev => ({
      ...prev,
      [cursoId]: !prev[cursoId]
    }));
  };

  const handleInscribirse = async (cursoId) => {
    if (!token) {
      toast.error("No hay token de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    const datos = inscripciones[cursoId];
    const camposObligatorios = ['nombreCompleto', 'correo', 'telefono', 'documentoIdentidad', 'numeroTarjeta', 'file'];
    
    for (const campo of camposObligatorios) {
      if (!datos || !datos[campo]) {
        toast.error(`Campo ${campo === 'file' ? 'PDF' : campo} es requerido.`);
        return;
      }
    }

    if (datos.numeroTarjeta.length < 10) {
      toast.error("El número de tarjeta debe tener al menos 10 dígitos.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    // Datos personales
    formData.append("nombreCompleto", datos.nombreCompleto);
    formData.append("correo", datos.correo);
    formData.append("telefono", datos.telefono);
    formData.append("documentoIdentidad", datos.documentoIdentidad);
    if (datos.fechaNacimiento) formData.append("fechaNacimiento", datos.fechaNacimiento);
    if (datos.direccion) formData.append("direccion", datos.direccion);
    if (datos.ciudad) formData.append("ciudad", datos.ciudad);
    
    // Datos de la inscripción
    formData.append("numeroTarjeta", datos.numeroTarjeta);
    formData.append("tarjetaPDF", datos.file);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/cursos/${cursoId}/inscribirse`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Solicitud de inscripción enviada correctamente.");
      
      // Limpiar el formulario y ocultarlo
      setInscripciones((prev) => ({
        ...prev,
        [cursoId]: { 
          nombreCompleto: "", 
          correo: "", 
          telefono: "", 
          documentoIdentidad: "", 
          fechaNacimiento: "", 
          direccion: "", 
          ciudad: "", 
          numeroTarjeta: "", 
          file: null 
        },
      }));
      setShowForm(prev => ({ ...prev, [cursoId]: false }));
      
      // Recargar los cursos para mostrar la inscripción
      const res = await getCursos(token);
      setCursos(res.data);
      
    } catch (err) {
      console.error("Error al inscribirse:", err.response?.data || err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Error de autenticación. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Datos incorrectos para la inscripción.");
      } else {
        toast.error(err.response?.data?.message || "Error al inscribirse. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isInscrito = (curso) => {
    if (!curso.inscritos || !Array.isArray(curso.inscritos)) return false;
    const userId = user?._id;
    return curso.inscritos.some(inscripcion => inscripcion.userId === userId);
  };

  const getEstadoInscripcion = (curso) => {
    if (!curso.inscritos || !Array.isArray(curso.inscritos)) return null;
    const userId = user?._id;
    const inscripcion = curso.inscritos.find(inscripcion => inscripcion.userId === userId);
    return inscripcion ? inscripcion.estado : null;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobada': return 'bg-green-100 text-green-800';
      case 'rechazada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'pendiente': return '⏳ Pendiente de revisión';
      case 'aprobada': return '✅ Inscripción aprobada';
      case 'rechazada': return '❌ Inscripción rechazada';
      default: return '❓ Estado desconocido';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Mis Cursos</h1>
      
      {!token && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          No estás autenticado. Por favor, inicia sesión.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cursos.map((curso) => {
          const inscrito = isInscrito(curso);
          const estado = getEstadoInscripcion(curso);
          
          return (
            <div key={curso._id} className="bg-white p-4 rounded shadow">
              <img
                src={curso.imagen}
                alt={curso.nombre}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-bold text-green-800">{curso.nombre}</h2>
              <p className="text-gray-600">{curso.descripcion}</p>
              
              {/* Información del curso */}
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>💳 Valor: ${curso.valor?.toLocaleString()}</span>
                  <span>👥 Cupos: {curso.cantidad}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>❤️ Likes: {curso.likes ? curso.likes.length : 0}</span>
                  <span>📚 Categoría: {curso.categoria || 'General'}</span>
                </div>
              </div>
              
              {inscrito ? (
                <div className="mt-4 p-3 rounded">
                  <div className={`p-3 rounded ${getEstadoColor(estado)}`}>
                    {getEstadoTexto(estado)}
                  </div>
                  {estado === 'rechazada' && (
                    <button
                      onClick={() => toggleForm(curso._id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Reenviar solicitud
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => toggleForm(curso._id)}
                  className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-full"
                >
                  Inscribirse
                </button>
              )}

              {/* Formulario de inscripción */}
              {showForm[curso._id] && (
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                  <h3 className="font-semibold text-gray-800 mb-3">Datos de Inscripción</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nombre completo *"
                      value={inscripciones[curso._id]?.nombreCompleto || ""}
                      onChange={(e) => handleChange(curso._id, "nombreCompleto", e.target.value)}
                      className="border p-2 rounded text-sm"
                      disabled={loading}
                    />
                    <input
                      type="email"
                      placeholder="Correo electrónico *"
                      value={inscripciones[curso._id]?.correo || ""}
                      onChange={(e) => handleChange(curso._id, "correo", e.target.value)}
                      className="border p-2 rounded text-sm"
                      disabled={loading}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono *"
                      value={inscripciones[curso._id]?.telefono || ""}
                      onChange={(e) => handleChange(curso._id, "telefono", e.target.value)}
                      className="border p-2 rounded text-sm"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      placeholder="Documento de identidad *"
                      value={inscripciones[curso._id]?.documentoIdentidad || ""}
                      onChange={(e) => handleChange(curso._id, "documentoIdentidad", e.target.value)}
                      className="border p-2 rounded text-sm"
                      disabled={loading}
                    />
                    <input
                      type="date"
                      placeholder="Fecha de nacimiento"
                      value={inscripciones[curso._id]?.fechaNacimiento || ""}
                      onChange={(e) => handleChange(curso._id, "fechaNacimiento", e.target.value)}
                      className="border p-2 rounded text-sm"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={inscripciones[curso._id]?.ciudad || ""}
                      onChange={(e) => handleChange(curso._id, "ciudad", e.target.value)}
                      className="border p-2 rounded text-sm"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={inscripciones[curso._id]?.direccion || ""}
                      onChange={(e) => handleChange(curso._id, "direccion", e.target.value)}
                      className="w-full border p-2 rounded text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Número de tarjeta *"
                      value={inscripciones[curso._id]?.numeroTarjeta || ""}
                      onChange={(e) => handleChange(curso._id, "numeroTarjeta", e.target.value)}
                      className="w-full border p-2 rounded text-sm"
                      disabled={loading}
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(curso._id, e.target.files[0])}
                      className="w-full border p-2 rounded text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleInscribirse(curso._id)}
                      disabled={loading}
                      className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800 text-white"
                      }`}
                    >
                      {loading ? "Enviando..." : "Enviar Solicitud"}
                    </button>
                    <button
                      onClick={() => toggleForm(curso._id)}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Miscurso;
