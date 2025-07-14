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
  FaCalendarAlt,
  FaInfoCircle,
  FaPlusCircle,
} from "react-icons/fa";
import { useState } from "react";

const cursosDemo = [
  {
    id: 1,
    titulo: "Mantenimiento Técnico",
    descripcion: "Curso de soporte en hardware y redes.",
    imagen: "https://images.unsplash.com/photo-1581090700227-1e8e287c0a5e",
    inscritos: 12,
    duracion: "80 horas",
    nivel: "Básico"
  },
  {
    id: 2,
    titulo: "Barismo",
    descripcion: "Aprende el arte del café de especialidad.",
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    inscritos: 25,
    duracion: "60 horas",
    nivel: "Intermedio"
  },
  {
    id: 3,
    titulo: "Programación Web",
    descripcion: "Desarrolla sitios modernos con HTML, CSS y JS.",
    imagen: "https://images.unsplash.com/photo-1537432376769-00a5f8ad3c4c",
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

  const InfoRol = () => {
    const base = "text-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row gap-4";
    if (user?.rol === "admin") {
      return (
        <div className={`${base} bg-gradient-to-r from-[#007832] to-[#3BA900]`}>
          <FaUserShield className="text-4xl" />
          <div>
            <h2 className="font-bold text-xl">Rol: Administrador</h2>
            <p>Control total sobre usuarios, cursos y reportes del sistema.</p>
            <div className="flex gap-3 mt-3">
              <button className="bg-white text-[#007832] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition">
                <FaChartLine /> Estadísticas
              </button>
              <button className="bg-[#005522] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#00441a] transition">
                <FaUsers /> Gestionar Usuarios
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (user?.rol === "instructor") {
      return (
        <div className={`${base} bg-gradient-to-r from-[#1A6C37] to-[#3BA900]`}>
          <FaChalkboardTeacher className="text-4xl" />
          <div>
            <h2 className="font-bold text-xl">Rol: Instructor</h2>
            <p>Gestiona cursos, materiales y visualiza aprendices.</p>
            <div className="flex gap-3 mt-3">
              <button className="bg-white text-[#1A6C37] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition">
                <FaPlusCircle /> Crear Curso
              </button>
              <button className="bg-[#0f4d25] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0c3b1b] transition">
                <FaUpload /> Subir Material
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${base} bg-gradient-to-r from-[#3BA900] to-[#1A6C37]`}>
        <FaUserGraduate className="text-4xl" />
        <div>
          <h2 className="font-bold text-xl">Rol: Aprendiz</h2>
          <p>Explora cursos, realiza seguimiento y accede a certificados.</p>
          <div className="flex gap-3 mt-3">
            <button className="bg-white text-[#3BA900] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition">
              <FaCalendarAlt /> Mi Horario
            </button>
            <button className="bg-[#2a7a08] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#226907] transition">
              <FaCertificate /> Certificados
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-7xl mx-auto border-l-[10px] border-[#3BA900]">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#3BA900] mb-1">
          ¡Bienvenido(a) <span className="text-[#007832]">{user?.nombre}</span>!
        </h1>
        <p className="text-lg text-gray-700">
          Has ingresado como <span className="font-semibold">{user?.rol}</span>.
        </p>
      </div>

      <InfoRol />

      <h2 className="text-3xl font-bold text-[#007832] mt-10 mb-4">Cursos {user?.rol === "admin" ? "Registrados" : user?.rol === "instructor" ? "Creados" : "Disponibles"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursosDemo.map((curso) => (
          <div key={curso.id} className="bg-white rounded-xl shadow hover:shadow-xl border border-green-100 overflow-hidden transition">
            <img src={curso.imagen} alt={curso.titulo} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{curso.titulo}</h3>
              <p className="text-sm text-gray-600 mb-2">{curso.descripcion}</p>
              <div className="text-sm text-gray-500 mb-4">
                <span className="mr-3"><FaCalendarAlt className="inline mr-1" /> {curso.duracion}</span>
                <span><FaInfoCircle className="inline mr-1" /> {curso.nivel}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleLike(curso.id)}
                  className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                    likes[curso.id] ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-800"
                  }`}
                >
                  <FaHeart /> {likes[curso.id] ? "Me gusta" : "Like"}
                </button>

                {user?.rol === "usuario" && (
                  <>
                    <button onClick={() => handleVerDetalles(curso.id)} className="px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
                      <FaBook className="inline" /> Detalles
                    </button>
                    <button onClick={() => handleInscribirse(curso.id)} className="px-3 py-1 rounded-md text-sm bg-green-700 text-white hover:bg-green-800">
                      <FaCheckCircle className="inline" /> Inscribirme
                    </button>
                  </>
                )}

                {user?.rol === "instructor" && (
                  <>
                    <button onClick={() => handleEdit(curso.id)} className="px-3 py-1 rounded-md text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleVerInscritos(curso.id)} className="px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:bg-green-700">
                      <FaUsers /> Inscritos
                    </button>
                  </>
                )}

                {user?.rol === "admin" && (
                  <>
                    <button onClick={() => handleEdit(curso.id)} className="px-3 py-1 rounded-md text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDelete(curso.id)} className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200">
                      <FaTrash /> Eliminar
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
};

export default Welcome;
