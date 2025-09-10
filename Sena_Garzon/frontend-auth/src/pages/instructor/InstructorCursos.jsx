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
  const [nuevoCurso, setNuevoCurso] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    cantidad: 0,
    valor: 0
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
      if (editandoId) {
        await updateCurso(editandoId, nuevoCurso, token);
      } else {
        await createCurso(nuevoCurso, token);
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
    setNuevoCurso(curso);
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
            name="valor"
            placeholder="Valor ($)"
            type="number"
            value={nuevoCurso.valor}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <button
          onClick={handleGuardar}
          className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-200"
        >
          <FaPlusCircle /> {editandoId ? "Actualizar" : "Guardar"} Curso
        </button>
      </div>

      {/* Cards de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
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
    </div>
  );
};

export default InstructorCursos;
