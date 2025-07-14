import {
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaUsers,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";
import { useState } from "react";

const initialCursos = [
  {
    id: 1,
    titulo: "Programación Web",
    descripcion: "Curso intensivo de desarrollo web.",
    imagen: "https://images.unsplash.com/photo-1537432376769-00a5f8ad3c4c",
    cupos: 20,
    inscritos: 12,
    inicio: "2025-08-01",
    fin: "2025-10-01",
    duracion: "120 horas",
    nivel: "Intermedio"
  }
];

const InstructorDashboard = () => {
  const [cursos, setCursos] = useState(initialCursos);
  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: "",
    descripcion: "",
    imagen: "",
    cupos: 0,
    inicio: "",
    fin: "",
    duracion: "",
    nivel: "Básico"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCurso({ ...nuevoCurso, [name]: value });
  };

  const agregarCurso = () => {
    setCursos([
      ...cursos,
      { ...nuevoCurso, id: Date.now(), inscritos: 0 }
    ]);
    setNuevoCurso({
      titulo: "",
      descripcion: "",
      imagen: "",
      cupos: 0,
      inicio: "",
      fin: "",
      duracion: "",
      nivel: "Básico"
    });
  };

  const eliminarCurso = (id) => {
    setCursos(cursos.filter((c) => c.id !== id));
  };

  const editarCurso = (id) => {
    const curso = cursos.find((c) => c.id === id);
    setNuevoCurso(curso);
    setCursos(cursos.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Panel del Instructor</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Agregar / Editar Curso</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="titulo" placeholder="Título" value={nuevoCurso.titulo} onChange={handleChange} className="border p-2 rounded" />
          <input name="descripcion" placeholder="Descripción" value={nuevoCurso.descripcion} onChange={handleChange} className="border p-2 rounded" />
          <input name="imagen" placeholder="URL Imagen" value={nuevoCurso.imagen} onChange={handleChange} className="border p-2 rounded" />
          <input name="cupos" placeholder="Cupos" type="number" value={nuevoCurso.cupos} onChange={handleChange} className="border p-2 rounded" />
          <input name="inicio" type="date" value={nuevoCurso.inicio} onChange={handleChange} className="border p-2 rounded" />
          <input name="fin" type="date" value={nuevoCurso.fin} onChange={handleChange} className="border p-2 rounded" />
          <input name="duracion" placeholder="Duración" value={nuevoCurso.duracion} onChange={handleChange} className="border p-2 rounded" />
          <select name="nivel" value={nuevoCurso.nivel} onChange={handleChange} className="border p-2 rounded">
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
        <button onClick={agregarCurso} className="mt-4 bg-green-700 text-white px-4 py-2 rounded flex items-center hover:bg-green-800">
          <FaPlusCircle className="mr-2" /> Guardar Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div key={curso.id} className="bg-white rounded-lg shadow p-4">
            <img src={curso.imagen} alt={curso.titulo} className="h-40 w-full object-cover rounded-md mb-2" />
            <h3 className="text-lg font-bold text-green-800">{curso.titulo}</h3>
            <p className="text-sm text-gray-600 mb-2">{curso.descripcion}</p>
            <p className="text-sm"><FaUsers className="inline mr-1 text-green-600" /> {curso.inscritos}/{curso.cupos} inscritos</p>
            <p className="text-sm"><FaCalendarAlt className="inline mr-1 text-green-600" /> {curso.inicio} a {curso.fin}</p>
            <p className="text-sm"><FaClock className="inline mr-1 text-green-600" /> {curso.duracion}</p>
            <p className="text-sm font-semibold">Nivel: {curso.nivel}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => editarCurso(curso.id)} className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center justify-center hover:bg-blue-200">
                <FaEdit className="mr-1" /> Editar
              </button>
              <button onClick={() => eliminarCurso(curso.id)} className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded flex items-center justify-center hover:bg-red-200">
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
