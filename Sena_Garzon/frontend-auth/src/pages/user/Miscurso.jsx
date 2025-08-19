import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getCursos } from "../../services/cursoService";
import { toast } from "react-toastify";

const Miscurso = () => {
  const [cursos, setCursos] = useState([]);
  const [likedCursos, setLikedCursos] = useState([]);
  const [inscripciones, setInscripciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState({});
  const token = localStorage.getItem("token");
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch (_) {
    user = null;
  }

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await getCursos(token);
        setCursos(res.data);
        // liked by current user
        const uid = user?._id;
        const liked = res.data.filter(c => Array.isArray(c.likes) && c.likes.some(l => l.userId === uid));
        setLikedCursos(liked);
        // Si venimos de Bienvenidos con un courseId, enfocar/mostrar
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('courseId');
        if (courseId) {
          const target = res.data.find(c => String(c._id) === String(courseId));
          if (target) {
            setShowForm(prev => ({ ...prev, [target._id]: true }));
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
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
      const response = await axios.post(`http://localhost:5000/api/cursos/${String(cursoId)}/inscribirse`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

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

  const cursosPendientes = useMemo(() => cursos.filter(c => {
    const uid = user?._id;
    const ins = (c.inscritos || []).find(i => i.userId === uid);
    return ins?.estado === 'pendiente';
  }), [cursos, user]);

  const cursosAprobados = useMemo(() => cursos.filter(c => {
    const uid = user?._id;
    const ins = (c.inscritos || []).find(i => i.userId === uid);
    return ins?.estado === 'aprobada';
  }), [cursos, user]);

  const cursosRechazados = useMemo(() => cursos.filter(c => {
    const uid = user?._id;
    const ins = (c.inscritos || []).find(i => i.userId === uid);
    return ins?.estado === 'rechazada';
  }), [cursos, user]);

  // Solo tus cursos (inscrito en cualquier estado)
  const cursosInscritos = useMemo(() => cursos.filter(c => {
    const uid = user?._id;
    return (c.inscritos || []).some(i => i.userId === uid);
  }), [cursos, user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-green-600">Mis Cursos</h1>
        <p className="text-gray-600">Gestiona tus inscripciones y continúa tu aprendizaje</p>
      </div>
      
      {!token && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          No estás autenticado. Por favor, inicia sesión.
        </div>
      )}
      
      {/* Tabs resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow border p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{cursosPendientes.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow border p-4">
          <p className="text-sm text-gray-500">Aprobados</p>
          <p className="text-2xl font-bold text-green-600">{cursosAprobados.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow border p-4">
          <p className="text-sm text-gray-500">Rechazados</p>
          <p className="text-2xl font-bold text-red-600">{cursosRechazados.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow border p-4">
          <p className="text-sm text-gray-500">Favoritos</p>
          <p className="text-2xl font-bold text-indigo-600">{likedCursos.length}</p>
        </div>
      </div>

      {/* Grid de cursos */}
      {/* Sección de favoritos */}
      {likedCursos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cursos que te gustan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {likedCursos.map(curso => (
              <div key={curso._id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
                <img src={curso.imagen} alt={curso.nombre} className="w-full h-44 object-cover rounded-lg mb-3" />
                <h3 className="text-lg font-bold text-gray-900">{curso.nombre}</h3>
                <p className="text-gray-600 text-sm">{curso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cursosInscritos.map((curso) => {
          const inscrito = isInscrito(curso);
          const estado = getEstadoInscripcion(curso);
          
          return (
            <div key={curso._id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
              <img
                src={curso.imagen}
                alt={curso.nombre}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-bold text-gray-900">{curso.nombre}</h2>
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
                </div>
              ) : null}

              {/* Sin formulario aquí: la inscripción se hace desde Bienvenidos */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Miscurso;
