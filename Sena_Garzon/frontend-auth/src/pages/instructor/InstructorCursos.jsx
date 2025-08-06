import {
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaUsers,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso
} from "../../services/cursoService";

const InstructorDashboard = () => {
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

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const res = await getCursos(token);
      setCursos(res.data);
    } catch (err) {
      console.error("Error al cargar cursos", err);
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
    } catch (err) {
      console.error("Error al guardar curso", err);
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
    } catch (err) {
      console.error("Error al eliminar curso", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Panel del Instructor</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Agregar / Editar Curso</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="nombre" placeholder="Nombre del curso" value={nuevoCurso.nombre} onChange={handleChange} className="border p-2 rounded" />
          <input name="descripcion" placeholder="Descripción" value={nuevoCurso.descripcion} onChange={handleChange} className="border p-2 rounded" />
          <input name="imagen" placeholder="URL Imagen" value={nuevoCurso.imagen} onChange={handleChange} className="border p-2 rounded" />
          <input name="cantidad" placeholder="Cupos" type="number" value={nuevoCurso.cantidad} onChange={handleChange} className="border p-2 rounded" />
          <input name="valor" placeholder="Valor ($)" type="number" value={nuevoCurso.valor} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <button onClick={handleGuardar} className="mt-4 bg-green-700 text-white px-4 py-2 rounded flex items-center hover:bg-green-800">
          <FaPlusCircle className="mr-2" /> {editandoId ? "Actualizar" : "Guardar"} Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div key={curso._id} className="bg-white rounded-lg shadow p-4">
            <img src={curso.imagen} alt={curso.nombre} className="h-40 w-full object-cover rounded-md mb-2" />
            <h3 className="text-lg font-bold text-green-800">{curso.nombre}</h3>
            <p className="text-sm text-gray-600 mb-2">{curso.descripcion}</p>
            <p className="text-sm"><FaUsers className="inline mr-1 text-green-600" /> Cupos: {curso.cantidad}</p>
            <p className="text-sm"><FaClock className="inline mr-1 text-green-600" /> Valor: ${curso.valor}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => handleEditar(curso)} className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center justify-center hover:bg-blue-200">
                <FaEdit className="mr-1" /> Editar
              </button>
              <button onClick={() => handleEliminar(curso._id)} className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded flex items-center justify-center hover:bg-red-200">
                <FaTrash className="mr-1" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;
