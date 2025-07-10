import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const InstructorList = () => {
  const [instructores, setInstructores] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", correo: "", especialidad: "" });

  const fetchInstructores = async () => {
    const res = await axios.get("http://localhost:5000/api/instructores");
    setInstructores(res.data);
  };

  const crearInstructor = async () => {
    try {
      await axios.post("http://localhost:5000/api/instructores", nuevo);
      setNuevo({ nombre: "", correo: "", especialidad: "" });
      toast.success("Instructor creado");
      fetchInstructores();
    } catch (err) {
      toast.error("Error al crear instructor");
    }
  };

  const eliminarInstructor = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/instructores/${id}`);
      toast.success("Instructor eliminado");
      fetchInstructores();
    }
  };

  useEffect(() => {
    fetchInstructores();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Panel de Instructores</h2>

      <div className="mb-6">
        <input
          className="border p-2 mr-2"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          placeholder="Nombre"
        />
        <input
          className="border p-2 mr-2"
          value={nuevo.correo}
          onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
          placeholder="Correo"
        />
        <input
          className="border p-2 mr-2"
          value={nuevo.especialidad}
          onChange={(e) => setNuevo({ ...nuevo, especialidad: e.target.value })}
          placeholder="Especialidad"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={crearInstructor}>
          Agregar
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Especialidad</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instructores.map((inst) => (
            <tr key={inst._id}>
              <td className="p-2 border">{inst.nombre}</td>
              <td className="p-2 border">{inst.correo}</td>
              <td className="p-2 border">{inst.especialidad}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => eliminarInstructor(inst._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorList;
