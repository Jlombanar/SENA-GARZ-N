import { FaBook, FaClock, FaCheckCircle, FaFileUpload, FaSearch, FaChartLine, FaCertificate, FaUserTie, FaCalendarAlt, FaRegStar, FaStar, FaEllipsisH, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

const MisCursos = () => {
  // Datos de ejemplo mejorados con más información
  const [cursos, setCursos] = useState({
    activos: [
      {
        id: 1,
        titulo: "Programación Básica",
        descripcion: "Fundamentos de programación con Python para principiantes",
        imagen: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        progreso: 65,
        fechaInicio: "15/03/2023",
        fechaFin: "15/06/2023",
        instructor: "Carlos Martínez",
        nivel: "Principiante",
        lecciones: 24,
        horas: 36,
        categoria: "Tecnología",
        ultimaLeccion: "Variables y tipos de datos",
        proximaClase: "20/05/2023"
      },
      {
        id: 2,
        titulo: "Diseño Gráfico Digital",
        descripcion: "Principios de diseño con herramientas modernas como Figma y Adobe XD",
        imagen: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
        progreso: 30,
        fechaInicio: "01/04/2023",
        fechaFin: "01/07/2023",
        instructor: "Ana Rodríguez",
        nivel: "Intermedio",
        lecciones: 18,
        horas: 24,
        categoria: "Diseño",
        ultimaLeccion: "Teoría del color",
        proximaClase: "22/05/2023"
      }
    ],
    pendientes: [
      {
        id: 3,
        titulo: "Electricidad Industrial",
        descripcion: "Conceptos avanzados de instalaciones eléctricas para entornos industriales",
        imagen: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
        documentosFaltantes: ["Documento de identidad", "Certificado de estudios"],
        fechaLimite: "30/05/2023",
        nivel: "Intermedio",
        lecciones: 20,
        horas: 30,
        categoria: "Técnico",
        instructor: "Pedro Sánchez",
        requisitos: "Conocimientos básicos de electricidad"
      },
      {
        id: 4,
        titulo: "Gastronomía Básica",
        descripcion: "Técnicas fundamentales de cocina internacional",
        imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
        documentosFaltantes: ["Certificado médico", "Carné de manipulación de alimentos"],
        fechaLimite: "15/06/2023",
        nivel: "Principiante",
        lecciones: 15,
        horas: 20,
        categoria: "Gastronomía",
        instructor: "María López",
        requisitos: "Ninguno"
      }
    ],
    completados: [
      {
        id: 5,
        titulo: "Introducción a la Electricidad",
        descripcion: "Conceptos básicos de instalaciones eléctricas domésticas",
        imagen: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        fechaCompletado: "10/02/2023",
        calificacion: 4.8,
        instructor: "Jorge López",
        nivel: "Principiante",
        lecciones: 12,
        horas: 18,
        categoria: "Técnico",
        certificadoDisponible: true,
        habilidades: ["Instalaciones básicas", "Seguridad eléctrica", "Herramientas"]
      },
      {
        id: 6,
        titulo: "Inglés Básico",
        descripcion: "Fundamentos del idioma inglés para comunicación diaria",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        fechaCompletado: "20/01/2023",
        calificacion: 4.5,
        instructor: "María González",
        nivel: "Principiante",
        lecciones: 30,
        horas: 40,
        categoria: "Idiomas",
        certificadoDisponible: true,
        habilidades: ["Gramática básica", "Vocabulario esencial", "Conversación"]
      }
    ]
  });

  const [busqueda, setBusqueda] = useState("");
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({
    activos: true,
    pendientes: true,
    completados: true
  });
  const [cursoExpandido, setCursoExpandido] = useState(null);

  // Filtrar cursos según la búsqueda
  const filtrarCursos = (categoria) => {
    return cursos[categoria].filter(curso => 
      curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      (curso.instructor && curso.instructor.toLowerCase().includes(busqueda.toLowerCase()))
    );
  };

  const toggleCategoria = (categoria) => {
    setCategoriasAbiertas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const toggleExpandirCurso = (cursoId) => {
    setCursoExpandido(cursoExpandido === cursoId ? null : cursoId);
  };

  const subirDocumento = (cursoId, documento) => {
    alert(`Documento ${documento} subido para el curso ${cursoId}`);
  };

  const descargarCertificado = (cursoId) => {
    alert(`Descargando certificado para el curso ${cursoId}`);
  };

  const continuarCurso = (cursoId) => {
    alert(`Continuando con el curso ${cursoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado mejorado */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#007832] mb-2">Mi Panel de Cursos</h1>
            <p className="text-lg text-gray-600">Gestiona tu progreso de aprendizaje</p>
          </div>
          
          {/* Barra de búsqueda mejorada */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Buscar cursos por nombre, instructor o categoría..."
              className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#3BA900] focus:ring-opacity-50 text-gray-700 placeholder-gray-400"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Sección de Cursos Activos */}
        <div className="mb-12 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Encabezado de categoría */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-[#3BA900]/10 to-[#3BA900]/5"
            onClick={() => toggleCategoria('activos')}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-[#3BA900]/20 mr-4">
                <FaBook className="text-2xl text-[#3BA900]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Cursos Activos</h2>
                <p className="text-gray-600 text-sm">Continúa con tu formación</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-[#3BA900] text-white text-sm font-medium px-3 py-1 rounded-full mr-4">
                {cursos.activos.length} cursos
              </span>
              {categoriasAbiertas.activos ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
          
          {/* Contenido de categoría */}
          {categoriasAbiertas.activos && (
            <div className="p-6 pt-0">
              {filtrarCursos('activos').length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No tienes cursos activos o no se encontraron resultados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtrarCursos('activos').map(curso => (
                    <div key={curso.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                      {/* Encabezado de la tarjeta */}
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                        onClick={() => toggleExpandirCurso(`activo-${curso.id}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                            <img 
                              src={curso.imagen} 
                              alt={curso.titulo}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{curso.titulo}</h3>
                            <p className="text-sm text-gray-500">{curso.instructor}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-200 rounded-full mr-4">
                            <div 
                              className="h-2 rounded-full bg-[#3BA900]" 
                              style={{ width: `${curso.progreso}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-[#3BA900]">{curso.progreso}%</span>
                        </div>
                      </div>
                      
                      {/* Contenido expandido */}
                      {cursoExpandido === `activo-${curso.id}` && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">DESCRIPCIÓN</h4>
                              <p className="text-gray-700">{curso.descripcion}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">PROGRESO</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Lección actual:</span>
                                    <span className="font-medium">{curso.ultimaLeccion}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-[#3BA900] h-2 rounded-full" 
                                      style={{ width: `${curso.progreso}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Próxima clase:</span>
                                  <span className="font-medium">{curso.proximaClase}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <button 
                              onClick={() => continuarCurso(curso.id)}
                              className="bg-[#3BA900] hover:bg-[#2f8c00] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                              Continuar curso
                            </button>
                            <button className="border border-[#3BA900] text-[#3BA900] hover:bg-[#3BA900]/10 px-4 py-2 rounded-lg text-sm font-medium transition">
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección de Cursos Pendientes */}
        <div className="mb-12 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Encabezado de categoría */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-[#D4A017]/10 to-[#D4A017]/5"
            onClick={() => toggleCategoria('pendientes')}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-[#D4A017]/20 mr-4">
                <FaFileUpload className="text-2xl text-[#D4A017]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Cursos Pendientes</h2>
                <p className="text-gray-600 text-sm">Documentos requeridos para comenzar</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-[#D4A017] text-white text-sm font-medium px-3 py-1 rounded-full mr-4">
                {cursos.pendientes.length} cursos
              </span>
              {categoriasAbiertas.pendientes ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
          
          {/* Contenido de categoría */}
          {categoriasAbiertas.pendientes && (
            <div className="p-6 pt-0">
              {filtrarCursos('pendientes').length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No tienes cursos pendientes o no se encontraron resultados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtrarCursos('pendientes').map(curso => (
                    <div key={curso.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                      {/* Encabezado de la tarjeta */}
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                        onClick={() => toggleExpandirCurso(`pendiente-${curso.id}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                            <img 
                              src={curso.imagen} 
                              alt={curso.titulo}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{curso.titulo}</h3>
                            <p className="text-sm text-gray-500">{curso.instructor}</p>
                          </div>
                        </div>
                        <div className="text-sm text-[#D4A017] font-medium">
                          {curso.documentosFaltantes.length} doc. faltantes
                        </div>
                      </div>
                      
                      {/* Contenido expandido */}
                      {cursoExpandido === `pendiente-${curso.id}` && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">DOCUMENTOS REQUERIDOS</h4>
                            <ul className="space-y-2">
                              {curso.documentosFaltantes.map((doc, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                  <span className="text-gray-700">{doc}</span>
                                  <button 
                                    onClick={() => subirDocumento(curso.id, doc)}
                                    className="bg-[#D4A017] hover:bg-[#b68a12] text-white px-3 py-1 rounded text-sm font-medium transition"
                                  >
                                    Subir
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-500">Fecha límite:</p>
                              <p className="font-medium text-gray-800">{curso.fechaLimite}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Requisitos:</p>
                              <p className="font-medium text-gray-800">{curso.requisitos}</p>
                            </div>
                          </div>
                          
                          <button className="w-full bg-[#D4A017] hover:bg-[#b68a12] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                            Ver información del curso
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección de Cursos Completados */}
        <div className="mb-12 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Encabezado de categoría */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-[#007832]/10 to-[#007832]/5"
            onClick={() => toggleCategoria('completados')}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-[#007832]/20 mr-4">
                <FaCheckCircle className="text-2xl text-[#007832]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Cursos Completados</h2>
                <p className="text-gray-600 text-sm">Revisa tus logros y certificados</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-[#007832] text-white text-sm font-medium px-3 py-1 rounded-full mr-4">
                {cursos.completados.length} cursos
              </span>
              {categoriasAbiertas.completados ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
          
          {/* Contenido de categoría */}
          {categoriasAbiertas.completados && (
            <div className="p-6 pt-0">
              {filtrarCursos('completados').length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No tienes cursos completados o no se encontraron resultados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtrarCursos('completados').map(curso => (
                    <div key={curso.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                      {/* Encabezado de la tarjeta */}
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                        onClick={() => toggleExpandirCurso(`completado-${curso.id}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                            <img 
                              src={curso.imagen} 
                              alt={curso.titulo}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{curso.titulo}</h3>
                            <p className="text-sm text-gray-500">Completado: {curso.fechaCompletado}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-4">
                            {[...Array(5)].map((_, i) => (
                              i < Math.floor(curso.calificacion) ? 
                                <FaStar key={i} className="w-4 h-4" /> : 
                                <FaRegStar key={i} className="w-4 h-4" />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{curso.calificacion}</span>
                        </div>
                      </div>
                      
                      {/* Contenido expandido */}
                      {cursoExpandido === `completado-${curso.id}` && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">LO QUE APRENDISTE</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {curso.habilidades.map((habilidad, index) => (
                                  <li key={index}>{habilidad}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">DETALLES</h4>
                              <div className="space-y-2 text-gray-700">
                                <p><span className="font-medium">Instructor:</span> {curso.instructor}</p>
                                <p><span className="font-medium">Duración:</span> {curso.horas} horas</p>
                                <p><span className="font-medium">Lecciones:</span> {curso.lecciones}</p>
                              </div>
                            </div>
                          </div>
                          
                          {curso.certificadoDisponible ? (
                            <button 
                              onClick={() => descargarCertificado(curso.id)}
                              className="w-full bg-[#007832] hover:bg-[#006529] text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center"
                            >
                              <FaCertificate className="mr-2" />
                              Descargar certificado
                            </button>
                          ) : (
                            <div className="text-center py-2 text-gray-500 text-sm">
                              Certificado disponible próximamente
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisCursos;