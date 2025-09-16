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
  const [activeSection, setActiveSection] = useState("todos");
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
        const uid = user?._id;
        const liked = res.data.filter(c => Array.isArray(c.likes) && c.likes.some(l => l.userId === uid));
        setLikedCursos(liked);
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
    
    formData.append("nombreCompleto", datos.nombreCompleto);
    formData.append("correo", datos.correo);
    formData.append("telefono", datos.telefono);
    formData.append("documentoIdentidad", datos.documentoIdentidad);
    if (datos.fechaNacimiento) formData.append("fechaNacimiento", datos.fechaNacimiento);
    if (datos.direccion) formData.append("direccion", datos.direccion);
    if (datos.ciudad) formData.append("ciudad", datos.ciudad);
    
    formData.append("numeroTarjeta", datos.numeroTarjeta);
    formData.append("tarjetaPDF", datos.file);

    try {
      const response = await axios.post(`http://localhost:5000/api/cursos/${String(cursoId)}/inscribirse`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

      toast.success(response.data.message || "Solicitud de inscripción enviada correctamente.");
      
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
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'aprobada': return 'bg-green-100 text-green-800 border-green-300';
      case 'rechazada': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const cursosInscritos = useMemo(() => cursos.filter(c => {
    const uid = user?._id;
    return (c.inscritos || []).some(i => i.userId === uid);
  }), [cursos, user]);

  // Función para renderizar una tarjeta de curso
  const renderCursoCard = (curso) => {
    const inscrito = isInscrito(curso);
    const estado = getEstadoInscripcion(curso);
    
    return (
      <div key={curso._id} className="bg-white rounded-3xl shadow-xl shadow-green-200 overflow-hidden border border-green-100 transition-all duration-300 hover:shadow-green-400 hover:scale-[1.02] relative z-10">
        <div className="relative">
          <img
            src={curso.imagen}
            alt={curso.nombre}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-bold text-green-900 shadow-lg border border-green-700 animate-pulse-slow">
            ${curso.valor?.toLocaleString()}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-950 mb-2">{curso.nombre}</h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{curso.descripcion}</p>
          
          {/* Información del curso */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-2 border border-green-200">
                <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <span>{curso.cantidad} cupos</span>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-2 border border-green-200">
                <svg className="w-4 h-4 text-green-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span>{curso.likes ? curso.likes.length : 0} likes</span>
            </div>
            <div className="flex items-center col-span-2">
              <div className="bg-green-100 p-2 rounded-lg mr-2 border border-green-200">
                <svg className="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <span>{curso.categoria || 'General'}</span>
            </div>
          </div>
          
          {inscrito ? (
            <div className={`p-4 rounded-xl text-center font-medium border-2 ${getEstadoColor(estado)}`}>
              {getEstadoTexto(estado)}
            </div>
          ) : (
            <button
              onClick={() => toggleForm(curso._id)}
              className="w-full relative group overflow-hidden font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-800 opacity-90 transition-opacity duration-300 group-hover:opacity-100 group-active:scale-95 group-active:brightness-125"></div>
              <span className="relative z-10 text-white group-hover:text-green-50">
                Inscribirse
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-green-950 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-950 mb-3">Mis Cursos SENA</h1>
          <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Gestiona tus inscripciones, revisa tu progreso y continúa tu aprendizaje</p>
        </div>
        
        {!token && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
            No estás autenticado. Por favor, inicia sesión.
          </div>
        )}
        
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div 
            className={`bg-white rounded-2xl shadow-xl p-6 border-4 transition-all duration-300 cursor-pointer hover:shadow-green-400 hover:-translate-y-1 ${activeSection === 'todos' ? 'border-green-700 shadow-green-300' : 'border-white hover:border-green-300'}`}
            onClick={() => setActiveSection('todos')}
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-4 rounded-xl mr-4 border border-green-200">
                <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Inscritos</p>
                <p className="text-3xl font-bold text-gray-800">{cursosInscritos.length}</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-2xl shadow-xl p-6 border-4 transition-all duration-300 cursor-pointer hover:shadow-green-400 hover:-translate-y-1 ${activeSection === 'pendientes' ? 'border-yellow-500 shadow-yellow-300' : 'border-white hover:border-yellow-300'}`}
            onClick={() => setActiveSection('pendientes')}
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 p-4 rounded-xl mr-4 border border-yellow-200">
                <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-3xl font-bold text-gray-800">{cursosPendientes.length}</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-2xl shadow-xl p-6 border-4 transition-all duration-300 cursor-pointer hover:shadow-green-400 hover:-translate-y-1 ${activeSection === 'aprobados' ? 'border-green-600 shadow-green-300' : 'border-white hover:border-green-300'}`}
            onClick={() => setActiveSection('aprobados')}
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-4 rounded-xl mr-4 border border-green-200">
                <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aprobados</p>
                <p className="text-3xl font-bold text-gray-800">{cursosAprobados.length}</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-2xl shadow-xl p-6 border-4 transition-all duration-300 cursor-pointer hover:shadow-green-400 hover:-translate-y-1 ${activeSection === 'favoritos' ? 'border-pink-500 shadow-pink-300' : 'border-white hover:border-pink-300'}`}
            onClick={() => setActiveSection('favoritos')}
          >
            <div className="flex items-center">
              <div className="bg-pink-100 p-4 rounded-xl mr-4 border border-pink-200">
                <svg className="w-6 h-6 text-pink-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Favoritos</p>
                <p className="text-3xl font-bold text-gray-800">{likedCursos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de cursos favoritos */}
        {activeSection === 'favoritos' && likedCursos.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-2 rounded-lg mr-3 border border-green-200">
                <svg className="w-6 h-6 text-green-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-900">Cursos que te gustan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {likedCursos.map(curso => renderCursoCard(curso))}
            </div>
          </div>
        )}

        {/* Sección de cursos según estado seleccionado */}
        <div>
          {activeSection !== 'favoritos' && (
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-2 rounded-lg mr-3 border border-green-200">
                <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-900">
                {activeSection === 'todos' && 'Todos mis cursos'}
                {activeSection === 'pendientes' && 'Cursos pendientes de aprobación'}
                {activeSection === 'aprobados' && 'Cursos aprobados'}
              </h2>
            </div>
          )}

          {/* Grid de cursos según la sección activa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeSection === 'todos' && cursosInscritos.map(curso => renderCursoCard(curso))}
            {activeSection === 'pendientes' && cursosPendientes.map(curso => renderCursoCard(curso))}
            {activeSection === 'aprobados' && cursosAprobados.map(curso => renderCursoCard(curso))}
            {activeSection === 'favoritos' && likedCursos.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-3xl shadow-lg border border-green-200">
                <div className="text-5xl mb-4 text-green-400 animate-pulse">❤️</div>
                <h3 className="text-xl font-medium text-green-900 mb-2">No tienes cursos favoritos</h3>
                <p className="text-green-700">Haz clic en el corazón en los cursos para agregarlos a favoritos</p>
              </div>
            )}
            {activeSection !== 'favoritos' && 
              ((activeSection === 'todos' && cursosInscritos.length === 0) ||
               (activeSection === 'pendientes' && cursosPendientes.length === 0) ||
               (activeSection === 'aprobados' && cursosAprobados.length === 0)) && (
              <div className="col-span-full text-center py-12 bg-white rounded-3xl shadow-lg border border-green-200">
                <div className="text-5xl mb-4 text-green-400 animate-bounce">📚</div>
                <h3 className="text-xl font-medium text-green-900 mb-2">
                  {activeSection === 'todos' && 'No estás inscrito en ningún curso'}
                  {activeSection === 'pendientes' && 'No tienes cursos pendientes'}
                  {activeSection === 'aprobados' && 'No tienes cursos aprobados'}
                </h3>
                <p className="text-green-700">Explora nuestros cursos y comienza tu aprendizaje</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Miscurso;