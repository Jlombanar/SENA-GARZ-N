import {
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaHeart,
  FaEdit,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import { useState } from "react";

// ✅ Cursos demo con imágenes 100% funcionales
const cursosDemo = [
  {
    id: 1,
    titulo: "Mantenimiento Técnico",
    descripcion: "Curso de soporte en hardware y redes.",
    imagen: "https://images.unsplash.com/photo-1581090700227-1e8e287c0a5e?auto=format&fit=crop&w=800&q=80",
    inscritos: 12,
  },
  {
    id: 2,
    titulo: "Barismo",
    descripcion: "Aprende el arte del café de especialidad.",
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    inscritos: 25,
  },
  {
    id: 3,
    titulo: "Ganadería",
    descripcion: "Cría y cuidado de animales de producción.",
    imagen: "https://images.unsplash.com/photo-1600488993681-bc3a5f50f73a?auto=format&fit=crop&w=800&q=80",
    inscritos: 9,
  },
  {
    id: 4,
    titulo: "Diseño Gráfico",
    descripcion: "Aprende diseño con herramientas modernas.",
    imagen: "https://images.unsplash.com/photo-1581092787765-dfbc665d80b4?auto=format&fit=crop&w=800&q=80",
    inscritos: 18,
  },
  {
    id: 5,
    titulo: "Marketing Digital",
    descripcion: "Impulsa marcas con estrategias efectivas.",
    imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    inscritos: 30,
  },
  {
    id: 6,
    titulo: "Electricidad Básica",
    descripcion: "Fundamentos de instalaciones eléctricas.",
    imagen: "https://images.unsplash.com/photo-1615390347090-6f0e42967e3d?auto=format&fit=crop&w=800&q=80",
    inscritos: 15,
  },
  {
    id: 7,
    titulo: "Panadería",
    descripcion: "Aprende recetas y técnicas de panadería.",
    imagen: "https://images.unsplash.com/photo-1605538038230-923d6d21e1c0?auto=format&fit=crop&w=800&q=80",
    inscritos: 22,
  },
  {
    id: 8,
    titulo: "Programación Web",
    descripcion: "Desarrolla sitios modernos con HTML, CSS y JS.",
    imagen: "https://images.unsplash.com/photo-1537432376769-00a5f8ad3c4c?auto=format&fit=crop&w=800&q=80",
    inscritos: 40,
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

  const renderInfoRol = () => {
    const iconClasses = "text-3xl text-[#007832] mt-1";
    const cardBase =
      "bg-green-50 border-l-4 border-green-500 shadow-md p-4 rounded-xl flex gap-3 items-start";

    switch (user?.rol) {
      case "admin":
        return (
          <div className={cardBase}>
            <FaUserShield className={iconClasses} />
            <p className="text-green-900 text-sm">
              Tienes <strong>acceso completo</strong> para administrar{" "}
              <strong>usuarios</strong>, <strong>cursos</strong> y{" "}
              <strong>recursos</strong> del sistema.
            </p>
          </div>
        );
      case "instructor":
        return (
          <div className={cardBase}>
            <FaChalkboardTeacher className={iconClasses} />
            <p className="text-green-900 text-sm">
              Puedes <strong>crear y gestionar cursos</strong>, subir materiales y consultar inscritos.
            </p>
          </div>
        );
      case "usuario":
        return (
          <div className={cardBase}>
            <FaUserGraduate className={iconClasses} />
            <p className="text-green-900 text-sm">
              Accede a los <strong>cursos disponibles</strong>, consulta tus horarios y descarga certificados.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCursos = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {cursosDemo.map((curso) => (
        <div
          key={curso.id}
          className="bg-white shadow-md rounded-xl overflow-hidden border border-green-100 hover:shadow-lg transition-all"
        >
          <img
            src={curso.imagen}
            alt={curso.titulo}
            className="w-full h-52 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-[#1A6C37]">{curso.titulo}</h3>
            <p className="text-gray-700 text-sm mt-1">{curso.descripcion}</p>

            {user?.rol === "admin" && (
              <p className="text-xs text-gray-500 mt-2">Inscritos: {curso.inscritos}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => toggleLike(curso.id)}
                className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition ${
                  likes[curso.id]
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-800"
                }`}
              >
                <FaHeart className="mr-2" />
                {likes[curso.id] ? "Me encanta" : "Dar me gusta"}
              </button>

              {user?.rol === "usuario" && (
                <button
                  onClick={() => handleInscribirse(curso.id)}
                  className="bg-[#3BA900] text-white px-3 py-1 text-sm rounded-full hover:bg-[#2f8c00] flex items-center"
                >
                  <FaCheckCircle className="mr-2" />
                  Inscribirme
                </button>
              )}

              {user?.rol === "instructor" && (
                <>
                  <button
                    onClick={() => handleEdit(curso.id)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full hover:bg-blue-200 flex items-center"
                  >
                    <FaEdit className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(curso.id)}
                    className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded-full hover:bg-red-200 flex items-center"
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
  );

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-7xl mx-auto border-l-[10px] border-[#3BA900] transition-all duration-300">
      <h1 className="text-4xl font-black text-[#3BA900] mb-2">¡Bienvenido(a) a SENA Garzón!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Hola{" "}
        <span className="font-semibold text-gray-900">{user?.nombre}</span>, has ingresado como{" "}
        <span className="italic font-medium text-[#007832]">{user?.rol}</span>.
      </p>

      {renderInfoRol()}

      <h2 className="text-2xl font-bold text-[#007832] mt-10 mb-4">
        {user?.rol === "admin"
          ? "Todos los Cursos"
          : user?.rol === "instructor"
          ? "Tus Cursos"
          : "Cursos Disponibles"}
      </h2>

      {renderCursos()}
    </div>
  );
};

export default Welcome;
