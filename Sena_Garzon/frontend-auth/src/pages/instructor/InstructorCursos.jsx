import {
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaUsers,
  FaClock,
  FaEye
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCursosInstructor,
  createCurso,
  updateCurso,
  deleteCurso
} from "../../services/cursoService";
import { toast } from "react-toastify";

const InstructorCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [nuevoCurso, setNuevoCurso] = useState({
    nombre: "",
    descripcion: "",
    informacionAdicional: "",
    imagen: "",
    cantidad: 0,
    duracion: "",
    modalidad: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const res = await getCursosInstructor(token);
      setCursos(res.data);
    } catch (err) {
      console.error("Error al cargar cursos", err);
      toast.error("Error al cargar cursos");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCurso({ ...nuevoCurso, [name]: value });
  };

  const handleGuardar = async () => {
    try {
      const payload = {
        nombre: nuevoCurso.nombre || "",
        descripcion: nuevoCurso.descripcion || "",
        informacionAdicional: typeof nuevoCurso.informacionAdicional === 'string' ? nuevoCurso.informacionAdicional : "",
        imagen: nuevoCurso.imagen || "",
        cantidad: Number(nuevoCurso.cantidad) || 0,
        duracion: nuevoCurso.duracion || "",
        modalidad: nuevoCurso.modalidad || ""
      };

      if (editandoId) {
        await updateCurso(editandoId, payload, token);
      } else {
        await createCurso(payload, token);
      }
      setNuevoCurso({
        nombre: "",
        descripcion: "",
        imagen: "",
        cantidad: 0,
        valor: 0
      });
      setEditandoId(null);
      cargarCursos();
      toast.success(editandoId ? "Curso actualizado" : "Curso creado");
    } catch (err) {
      console.error("Error al guardar curso", err);
      toast.error("Error al guardar curso");
    }
  };

  const handleEditar = (curso) => {
    setNuevoCurso({
      nombre: curso.nombre || "",
      descripcion: curso.descripcion || "",
      informacionAdicional: curso.informacionAdicional || "",
      imagen: curso.imagen || "",
      cantidad: typeof curso.cantidad === 'number' ? curso.cantidad : Number(curso.cantidad) || 0,
      valor: typeof curso.valor === 'number' ? curso.valor : Number(curso.valor) || 0,
      duracion: curso.duracion || "",
      modalidad: curso.modalidad || ""
    });
    setEditandoId(curso._id);
  };

  const handleEliminar = async (id) => {
    try {
      await deleteCurso(id, token);
      cargarCursos();
      toast.success("Curso eliminado");
    } catch (err) {
      console.error("Error al eliminar curso", err);
      toast.error("Error al eliminar curso");
    }
  };

  const verInscripciones = () => {
    navigate("/instructor");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Mis Cursos</h1>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex justify-end">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm placeholder-gray-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">🔎</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Agregar / Editar Curso
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="nombre"
            placeholder="Nombre del curso"
            value={nuevoCurso.nombre}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            name="descripcion"
            placeholder="Descripción"
            value={nuevoCurso.descripcion}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <textarea
            name="informacionAdicional"
            placeholder="Información adicional del curso (temario, requisitos, modalidad, etc.)"
            value={nuevoCurso.informacionAdicional}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none col-span-2 h-28"
          />
          <input
            name="imagen"
            placeholder="URL Imagen"
            value={nuevoCurso.imagen}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            name="cantidad"
            placeholder="Cupos"
            type="number"
            value={nuevoCurso.cantidad}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            name="duracion"
            placeholder="Duración (ej: 120 horas)"
            value={nuevoCurso.duracion}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <select
            name="modalidad"
            value={nuevoCurso.modalidad}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Seleccionar modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Mixta">Mixta</option>
          </select>
        </div>
        <button
          onClick={handleGuardar}
          className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-200"
        >
          <FaPlusCircle /> {editandoId ? "Actualizar" : "Guardar"} Curso
        </button>
      </div>

      {/* Cards de Cursos */}
      {(() => {
        const term = searchTerm.trim().toLowerCase();
        const filtered = term
          ? cursos.filter(c =>
              (c.nombre || "").toLowerCase().includes(term) ||
              (c.descripcion || "").toLowerCase().includes(term)
            )
          : cursos;
        const cursosToShow = showAll ? filtered : filtered.slice(0, 6);
        return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursosToShow.map((curso) => (
          <div
            key={curso._id}
            className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
          >
            <img
              src={curso.imagen}
              alt={curso.nombre}
              className="h-40 w-full object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-bold text-green-800">{curso.nombre}</h3>
            <p className="text-sm text-gray-600 mb-2">{curso.descripcion}</p>
            <p className="text-sm">
              <FaUsers className="inline mr-1 text-green-600" /> Cupos:{" "}
              {curso.cantidad}
            </p>
            <p className="text-sm">
              <FaClock className="inline mr-1 text-green-600" /> Valor: $
              {curso.valor}
            </p>

            {/* Botones de acción */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => handleEditar(curso)}
                className="flex-1 min-w-[110px] bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1 shadow-md hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200"
              >
                <FaEdit /> Editar
              </button>

              <button
                onClick={() => handleEliminar(curso._id)}
                className="flex-1 min-w-[110px] bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1 shadow-md hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-200"
              >
                <FaTrash /> Eliminar
              </button>

              <button
                onClick={verInscripciones}
                className="flex-1 min-w-[140px] bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1 shadow-md hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-200"
              >
                <FaEye /> Ver Inscripciones
              </button>
            </div>
          </div>
        ))}
      </div>
        );
      })()}

      {/* Ver más / menos */}
      <div className="mt-6 flex justify-center">
        {!showAll ? (
          <button
            onClick={() => setShowAll(true)}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow hover:from-green-700 hover:to-green-800"
          >
            Ver más cursos
          </button>
        ) : (
          <button
            onClick={() => setShowAll(false)}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow hover:from-green-700 hover:to-green-800"
          >
            Mostrar menos
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorCursos;
