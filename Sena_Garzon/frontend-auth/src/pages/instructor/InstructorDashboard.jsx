import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  getCursosInstructor,
  getInscripcionesCurso,
  revisarInscripcion,
  eliminarInscripcion
} from "../../services/cursoService";

const InstructorDashboard = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInscripciones, setLoadingInscripciones] = useState(false);
  const [stats, setStats] = useState({
    totalCursos: 0,
    totalInscripciones: 0,
    inscripcionesPendientes: 0
  });
  const [observaciones, setObservaciones] = useState({});
  const [modoPrueba, setModoPrueba] = useState(false);
  const [soloPendientes, setSoloPendientes] = useState(false);
  const inscripcionesSectionRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const buildPdfHref = (rawUrl) => {
    if (!rawUrl) return null;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    let path = rawUrl;
    if (!path.startsWith('/uploads/')) {
      if (path.startsWith('uploads/')) path = `/${path}`; else path = `/uploads/${path}`;
    }
  return `${import.meta.env.VITE_API_URL}${path}`;

  };

  useEffect(() => {
    cargarCursos();
    const interval = setInterval(cargarCursos, 30000);
    return () => clearInterval(interval);
  }, []);

  const scrollToInscripciones = () => {
    if (inscripcionesSectionRef.current) {
      inscripcionesSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const cargarCursos = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        setCursos([]);
        setStats({ totalCursos: 0, totalInscripciones: 0, inscripcionesPendientes: 0 });
        setLoading(false);
        return;
      }

      const res = await getCursosInstructor(token);
      const cursosData = res.data || [];
      setCursos(cursosData);
      setModoPrueba(false);
      
      const totalInscripciones = cursosData.reduce((total, curso) => 
        total + (curso.inscritos ? curso.inscritos.length : 0), 0
      );
      
      const inscripcionesPendientes = cursosData.reduce((total, curso) => 
        total + (curso.inscritos ? curso.inscritos.filter(ins => ins.estado === 'pendiente').length : 0), 0
      );

      setStats({ totalCursos: cursosData.length, totalInscripciones, inscripcionesPendientes });

      if (cursosData.length > 0) {
        await cargarInscripciones(cursosData[0]._id);
        setSelectedCurso(cursosData[0]);
      }
    } catch (err) {
      setModoPrueba(false);
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message;
      const isNetwork = err?.message?.includes('Network') || err?.code === 'ERR_NETWORK';

      // Limpiar datos en error
      setCursos([]);
      setSelectedCurso(null);
      setInscripciones([]);
      setStats({ totalCursos: 0, totalInscripciones: 0, inscripcionesPendientes: 0 });

      if (status === 401 || status === 403) {
        toast.error('Tu sesión expiró o no tienes permisos. Inicia sesión nuevamente.');
        navigate('/login');
      } else if (isNetwork) {
        toast.error('No se puede conectar al backend (Network/CORS). Verifica que el servidor esté activo.');
      } else {
        toast.error(backendMsg || 'Error al cargar tus cursos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cargarInscripciones = async (cursoId) => {
    if (modoPrueba) {
      const curso = cursos.find(c => c._id === cursoId);
      setInscripciones(curso ? curso.inscritos : []);
      return;
    }

    try {
      setLoadingInscripciones(true);
      const res = await getInscripcionesCurso(cursoId, token);
      const inscripcionesData = res.data.inscripciones || [];
      setInscripciones(inscripcionesData);
    } catch (error) {
      setInscripciones([]);
    } finally {
      setLoadingInscripciones(false);
    }
  };

  const handleCursoChange = async (cursoId) => {
    const curso = cursos.find(c => c._id === cursoId);
    setSelectedCurso(curso);
    await cargarInscripciones(cursoId);
  };

  const inscripcionesFiltradas = soloPendientes
    ? inscripciones.filter(i => i.estado === 'pendiente')
    : inscripciones;

  const handleClickTotalCursos = () => {
    navigate('/instructor/cursos');
  };

  const handleClickTotalInscripciones = () => {
    setSoloPendientes(false);
    scrollToInscripciones();
  };

  const handleClickPendientes = () => {
    setSoloPendientes(true);
    scrollToInscripciones();
  };

  const handleAprobar = async (inscripcionId) => {
    if (modoPrueba) {
      setInscripciones(prev => prev.map(ins => ins._id === inscripcionId ? { ...ins, estado: 'aprobada' } : ins));
      toast.success("Inscripción aprobada exitosamente (modo prueba)");
      return;
    }
    try {
      await revisarInscripcion(selectedCurso._id, inscripcionId, {
        estado: "aprobada",
        observacionesInstructor: observaciones[inscripcionId] || ""
      }, token);
      toast.success("Inscripción aprobada exitosamente");
      await cargarInscripciones(selectedCurso._id);
      await cargarCursos();
      setObservaciones(prev => ({ ...prev, [inscripcionId]: "" }));
    } catch (error) {
      toast.error("Error al aprobar la inscripción");
    }
  };

  const handleRechazar = async (inscripcionId) => {
    if (modoPrueba) {
      setInscripciones(prev => prev.map(ins => ins._id === inscripcionId ? { ...ins, estado: 'rechazada' } : ins));
      toast.success("Inscripción rechazada exitosamente (modo prueba)");
      return;
    }
    try {
      await revisarInscripcion(selectedCurso._id, inscripcionId, {
        estado: "rechazada",
        observacionesInstructor: observaciones[inscripcionId] || ""
      }, token);
      toast.success("Inscripción rechazada exitosamente");
      await cargarInscripciones(selectedCurso._id);
      await cargarCursos();
      setObservaciones(prev => ({ ...prev, [inscripcionId]: "" }));
    } catch (error) {
      toast.error("Error al rechazar la inscripción");
    }
  };

  const handleEliminar = async (inscripcionId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta inscripción?")) {
      if (modoPrueba) {
        setInscripciones(prev => prev.filter(ins => ins._id !== inscripcionId));
        toast.success("Inscripción eliminada exitosamente (modo prueba)");
        return;
      }
      try {
        await eliminarInscripcion(selectedCurso._id, inscripcionId, token);
        toast.success("Inscripción eliminada exitosamente");
        await cargarInscripciones(selectedCurso._id);
        await cargarCursos();
      } catch (error) {
        toast.error("Error al eliminar la inscripción");
      }
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "aprobada": return "bg-green-100 text-green-800";
      case "rechazada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "pendiente": return "⏰";
      case "aprobada": return "✅";
      case "rechazada": return "❌";
      default: return "⏰";
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {modoPrueba && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <strong>Modo Prueba:</strong> El backend no está disponible. Mostrando datos simulados para demostración.
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Dashboard del Instructor</h1>
        <div className="flex gap-2">
          <button onClick={cargarCursos} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">🔄 Actualizar</button>
          <button onClick={() => navigate('/instructor/cursos')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">📚 Gestionar Cursos</button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl font-bold">📚</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">¡Bienvenido, {user.nombre || 'Instructor'}!</h2>
            <p className="text-green-100">Gestiona tus cursos y revisa las inscripciones de tus estudiantes</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button onClick={handleClickTotalCursos} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow text-left cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCursos}</p>
            </div>
          </div>
        </button>

        <button onClick={handleClickTotalInscripciones} className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow text-left cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Inscripciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInscripciones}</p>
            </div>
          </div>
        </button>

        <button onClick={handleClickPendientes} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow text-left cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inscripcionesPendientes}</p>
              {stats.inscripcionesPendientes > 0 && (
                <p className="text-xs text-yellow-600 mt-1">¡Revisa abajo!</p>
              )}
            </div>
        </div>
        </button>
      </div>

      {/* Sección de Gestión de Inscripciones */}
      <div ref={inscripcionesSectionRef} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Inscripciones</h2>
          <p className="text-gray-600 text-sm">Revisa y gestiona las solicitudes de inscripción de tus cursos</p>
        </div>

        <div className="p-6">
          {cursos.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">👥</span>
              <p className="text-gray-500 text-lg mb-2">No tienes cursos disponibles</p>
              <p className="text-gray-400 text-sm">Crea un curso para ver las inscripciones</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Curso:</label>
                <select value={selectedCurso?._id || ""} onChange={(e) => handleCursoChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
        {cursos.map((curso) => (
                    <option key={curso._id} value={curso._id}>{curso.nombre} - {curso.inscritos ? curso.inscritos.length : 0} inscripciones</option>
                  ))}
                </select>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <span className={`px-3 py-1 rounded-full ${soloPendientes ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>Filtro: {soloPendientes ? 'Pendientes' : 'Todos'}</span>
                  {soloPendientes && (
                    <button onClick={() => setSoloPendientes(false)} className="text-green-600 hover:text-green-700">Quitar filtro</button>
                  )}
                </div>
              </div>

              {loadingInscripciones ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando inscripciones...</p>
                  </div>
                </div>
              ) : inscripcionesFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl">👥</span>
                  <p className="text-gray-500 text-lg mb-2">No hay inscripciones {soloPendientes ? 'pendientes' : ''}</p>
                  <p className="text-gray-400 text-sm">Aún no hay inscripciones para este curso</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inscripcionesFiltradas.map((inscripcion) => {
                    const pdfRaw = inscripcion.tarjetaPDFUrl || inscripcion.pdf;
                    const pdfHref = buildPdfHref(pdfRaw);
                    return (
                      <div key={inscripcion._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{inscripcion.nombreCompleto || inscripcion.usuario?.nombre || "Sin nombre"}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(inscripcion.estado)}`}>{getStatusIcon(inscripcion.estado)}{inscripcion.estado || "pendiente"}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p><strong>Email:</strong> {inscripcion.correo || inscripcion.usuario?.email || "No disponible"}</p>
                                <p><strong>Teléfono:</strong> {inscripcion.telefono || "No disponible"}</p>
                                <p><strong>Documento:</strong> {inscripcion.documentoIdentidad || "No disponible"}</p>
                              </div>
                              <div>
                                <p><strong>Fecha de inscripción:</strong> {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}</p>
                                <p><strong>Número de tarjeta:</strong> {inscripcion.numeroTarjeta || "No disponible"}</p>
                                <p><strong>Dirección:</strong> {inscripcion.direccion || "No disponible"}</p>
                              </div>
                            </div>
                            {inscripcion.observacionesInstructor && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800"><strong>Observaciones:</strong> {inscripcion.observacionesInstructor}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            {pdfHref && (
                              <a href={pdfHref} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">📄 Ver PDF</a>
                            )}
                            <button onClick={() => handleEliminar(inscripcion._id)} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors">🗑️ Eliminar</button>
            </div>
          </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones:</label>
                          <textarea value={observaciones[inscripcion._id] || ""} onChange={(e) => setObservaciones(prev => ({ ...prev, [inscripcion._id]: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" rows="2" placeholder="Agregar observaciones..." />
                        </div>
                        {inscripcion.estado === "pendiente" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleAprobar(inscripcion._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">✅ Aprobar</button>
                            <button onClick={() => handleRechazar(inscripcion._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">❌ Rechazar</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
