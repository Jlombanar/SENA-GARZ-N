import {
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaHeart,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaBook,
  FaCertificate,
  FaUpload,
  FaCalendarAlt
} from "react-icons/fa";
import { useState } from "react";

// Cursos demo con imágenes
const cursosDemo = [
  {
    id: 1,
    titulo: "Mantenimiento Técnico",
    descripcion: "Curso de soporte en hardware y redes.",
    imagen: "https://images.unsplash.com/photo-1581090700227-1e8e287c0a5e?auto=format&fit=crop&w=800&q=80",
    inscritos: 12,
    duracion: "80 horas",
    nivel: "Básico"
  },
  {
    id: 2,
    titulo: "Barismo",
    descripcion: "Aprende el arte del café de especialidad.",
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    inscritos: 25,
    duracion: "60 horas",
    nivel: "Intermedio"
  },
  {
    id: 3,
    titulo: "Ganadería",
    descripcion: "Cría y cuidado de animales de producción.",
    imagen: "https://images.unsplash.com/photo-1600488993681-bc3a5f50f73a?auto=format&fit=crop&w=800&q=80",
    inscritos: 9,
    duracion: "100 horas",
    nivel: "Avanzado"
  },
  {
    id: 4,
    titulo: "Diseño Gráfico",
    descripcion: "Aprende diseño con herramientas modernas.",
    imagen: "https://images.unsplash.com/photo-1581092787765-dfbc665d80b4?auto=format&fit=crop&w=800&q=80",
    inscritos: 18,
    duracion: "120 horas",
    nivel: "Intermedio"
  },
  {
    id: 5,
    titulo: "Marketing Digital",
    descripcion: "Impulsa marcas con estrategias efectivas.",
    imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    inscritos: 30,
    duracion: "90 horas",
    nivel: "Avanzado"
  },
  {
    id: 6,
    titulo: "Electricidad Básica",
    descripcion: "Fundamentos de instalaciones eléctricas.",
    imagen: "https://images.unsplash.com/photo-1615390347090-6f0e42967e3d?auto=format&fit=crop&w=800&q=80",
    inscritos: 15,
    duracion: "80 horas",
    nivel: "Básico"
  },
  {
    id: 7,
    titulo: "Panadería",
    descripcion: "Aprende recetas y técnicas de panadería.",
    imagen: "https://images.unsplash.com/photo-1605538038230-923d6d21e1c0?auto=format&fit=crop&w=800&q=80",
    inscritos: 22,
    duracion: "70 horas",
    nivel: "Intermedio"
  },
  {
    id: 8,
    titulo: "Programación Web",
    descripcion: "Desarrolla sitios modernos con HTML, CSS y JS.",
    imagen: "https://images.unsplash.com/photo-1537432376769-00a5f8ad3c4c?auto=format&fit=crop&w=800&q=80",
    inscritos: 40,
    duracion: "150 horas",
    nivel: "Avanzado"
  },
];

const Welcome = ({ user }) => {
  const [likes, setLikes] = useState({});

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id) => alert(`Editar curso con ID: ${id}`);
  const handleDelete = (id) => alert(`Eliminar curso con ID: ${id}`);
  const handleInscribirse = (id) => alert(`Inscribirse al curso con ID: ${id}`);
  const handleVerDetalles = (id) => alert(`Ver detalles del curso con ID: ${id}`);
  const handleVerInscritos = (id) => alert(`Ver inscritos del curso con ID: ${id}`);

  const renderInfoRol = () => {
    const iconClasses = "text-4xl text-white p-3 rounded-full";
    const cardBase = "p-6 rounded-2xl shadow-lg flex gap-5 items-center";
    const textBase = "text-white text-lg";

    switch (user?.rol) {
      case "admin":
        return (
          <div className={`${cardBase} bg-gradient-to-r from-[#007832] to-[#3BA900]`}>
            <div className="bg-[#005522] rounded-full">
              <FaUserShield className={iconClasses} />
            </div>
            <div>
              <h3 className={`${textBase} font-bold text-xl mb-1`}>ROL: ADMINISTRADOR</h3>
              <p className={`${textBase}`}>
                Tienes control total sobre usuarios, cursos, estadísticas y configuración del sistema.
              </p>
              <div className="flex gap-3 mt-3">
                <button className="bg-white text-[#007832] px-4 py-2 rounded-full font-medium flex items-center hover:bg-gray-100">
                  <FaChartLine className="mr-2" /> Estadísticas
                </button>
                <button className="bg-[#005522] text-white px-4 py-2 rounded-full font-medium flex items-center hover:bg-[#004419]">
                  <FaUsers className="mr-2" /> Gestionar Usuarios
                </button>
              </div>
            </div>
          </div>
        );
      case "instructor":
        return (
          <div className={`${cardBase} bg-gradient-to-r from-[#1A6C37] to-[#3BA900]`}>
            <div className="bg-[#0d4a21] rounded-full">
              <FaChalkboardTeacher className={iconClasses} />
            </div>
            <div>
              <h3 className={`${textBase} font-bold text-xl mb-1`}>ROL: INSTRUCTOR</h3>
              <p className={`${textBase}`}>
                Crea y gestiona tus cursos, sube materiales y sigue el progreso de tus aprendices.
              </p>
              <div className="flex gap-3 mt-3">
                <button className="bg-white text-[#1A6C37] px-4 py-2 rounded-full font-medium flex items-center hover:bg-gray-100">
                  <FaBook className="mr-2" /> Nuevo Curso
                </button>
                <button className="bg-[#0d4a21] text-white px-4 py-2 rounded-full font-medium flex items-center hover:bg-[#0a3d1b]">
                  <FaUpload className="mr-2" /> Subir Material
                </button>
              </div>
            </div>
          </div>
        );
      case "usuario":
        return (
          <div className={`${cardBase} bg-gradient-to-r from-[#3BA900] to-[#1A6C37]`}>
            <div className="bg-[#2a7a08] rounded-full">
              <FaUserGraduate className={iconClasses} />
            </div>
            <div>
              <h3 className={`${textBase} font-bold text-xl mb-1`}>ROL: APRENDIZ</h3>
              <p className={`${textBase}`}>
                Explora cursos disponibles, lleva tu progreso y descarga certificados.
              </p>
              <div className="flex gap-3 mt-3">
                <button className="bg-white text-[#3BA900] px-4 py-2 rounded-full font-medium flex items-center hover:bg-gray-100">
                  <FaCalendarAlt className="mr-2" /> Mi Horario
                </button>
                <button className="bg-[#2a7a08] text-white px-4 py-2 rounded-full font-medium flex items-center hover:bg-[#226907]">
                  <FaCertificate className="mr-2" /> Mis Certificados
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCursos = () => (
    <div className="mt-10 relative">
      {/* Diagonal background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00783210] via-white to-[#3BA90010] -rotate-2 -z-10 rounded-xl"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transform rotate-1">
        {cursosDemo.map((curso, index) => (
          <div 
            key={curso.id}
            className={`bg-white shadow-xl rounded-2xl overflow-hidden border-2 border-green-100 hover:border-[#3BA900] hover:shadow-2xl transition-all duration-300 transform hover:-rotate-1 hover:scale-[1.02] ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
          >
            <div className="relative">
              <img
                src={curso.imagen}
                alt={curso.titulo}
                className="w-full h-56 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{curso.titulo}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-[#3BA900] text-white px-2 py-1 rounded-full">
                    {curso.nivel}
                  </span>
                  <span className="text-xs text-white ml-2">
                    <FaCalendarAlt className="inline mr-1" />
                    {curso.duracion}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-gray-700 mb-4">{curso.descripcion}</p>
              
              {user?.rol === "admin" && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    <FaUsers className="inline mr-1" />
                    {curso.inscritos} inscritos
                  </span>
                  <span className="text-xs bg-[#007832] text-white px-2 py-1 rounded-full">
                    ID: {curso.id}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleLike(curso.id)}
                  className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                    likes[curso.id]
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-800"
                  }`}
                >
                  <FaHeart className="mr-2" />
                  {likes[curso.id] ? "Me encanta" : "Like"}
                </button>

                {user?.rol === "usuario" && (
                  <>
                    <button
                      onClick={() => handleVerDetalles(curso.id)}
                      className="bg-[#3BA900]/10 text-[#3BA900] px-3 py-2 text-sm rounded-lg hover:bg-[#3BA900]/20 flex items-center"
                    >
                      <FaBook className="mr-2" />
                      Detalles
                    </button>
                    <button
                      onClick={() => handleInscribirse(curso.id)}
                      className="bg-[#3BA900] text-white px-3 py-2 text-sm rounded-lg hover:bg-[#2f8c00] flex items-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Inscribirme
                    </button>
                  </>
                )}

                {user?.rol === "instructor" && (
                  <>
                    <button
                      onClick={() => handleEdit(curso.id)}
                      className="bg-blue-100 text-blue-700 px-3 py-2 text-sm rounded-lg hover:bg-blue-200 flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleVerInscritos(curso.id)}
                      className="bg-[#007832] text-white px-3 py-2 text-sm rounded-lg hover:bg-[#006529] flex items-center"
                    >
                      <FaUsers className="mr-2" />
                      Inscritos
                    </button>
                  </>
                )}

                {user?.rol === "admin" && (
                  <>
                    <button
                      onClick={() => handleEdit(curso.id)}
                      className="bg-blue-100 text-blue-700 px-3 py-2 text-sm rounded-lg hover:bg-blue-200 flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(curso.id)}
                      className="bg-red-100 text-red-700 px-3 py-2 text-sm rounded-lg hover:bg-red-200 flex items-center"
                    >
                      <FaTrash className="mr-2" />
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-7xl mx-auto border-l-[16px] border-[#3BA900] transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#3BA900] mb-2">
          ¡Bienvenido(a) a <span className="text-[#007832]">SENA Garzón!</span>
        </h1>
        <p className="text-lg text-gray-700">
          Hola <span className="font-semibold text-gray-900">{user?.nombre}</span>, 
          has ingresado como <span className="font-bold text-[#007832]">{user?.rol}</span>.
        </p>
      </div>

      {renderInfoRol()}

      <h2 className="text-3xl font-bold text-[#007832] mt-12 mb-6 relative inline-block">
        {user?.rol === "admin"
          ? "Todos los Cursos"
          : user?.rol === "instructor"
          ? "Tus Cursos"
          : "Cursos Disponibles"}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-[#3BA900] rounded-full"></span>
      </h2>

      {renderCursos()}
    </div>
  );
};

export default Welcome;