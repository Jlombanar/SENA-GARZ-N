import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const InstructorList = () => {
  const [instructores, setInstructores] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", correo: "", especialidad: "" });

  const fetchInstructores = async () => {
    const res = await axios.get("http://localhost:5000/api/instructores");
    setInstructores(res.data || []);
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

  const eliminarInstructor = async (id, esUsuario, nombre) => {
    let confirmMessage = "";
    let confirmButtonText = "";

    if (esUsuario) {
      confirmMessage = `¿Estás seguro de que quieres remover a "${nombre}" como instructor? Su rol cambiará a usuario regular.`;
      confirmButtonText = "Sí, remover";
    } else {
      confirmMessage = `¿Estás seguro de que quieres eliminar al instructor "${nombre}"?`;
      confirmButtonText = "Sí, eliminar";
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/instructores/${id}`, {
          data: { esUsuario }
        });
        
        if (esUsuario) {
          toast.success("Instructor removido exitosamente");
        } else {
          toast.success("Instructor eliminado exitosamente");
        }
        
        fetchInstructores();
      } catch (error) {
        console.error("Error al eliminar instructor:", error);
        toast.error("Error al eliminar instructor");
      }
    }
  };

  useEffect(() => {
    fetchInstructores();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-700">Panel de Instructores</h2>
        <button
          onClick={fetchInstructores}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🔄 Actualizar
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          placeholder="Nombre"
        />
        <input
          className="border p-2 rounded flex-1"
          value={nuevo.correo}
          onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
          placeholder="Correo"
        />
        <input
          className="border p-2 rounded flex-1"
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
          <tr className="bg-gray-50">
            <th className="p-2 border text-left">Nombre</th>
            <th className="p-2 border text-left">Correo</th>
            <th className="p-2 border text-left">Especialidad</th>
            <th className="p-2 border text-left">Origen</th>
            <th className="p-2 border text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instructores.map((inst) => (
            <tr key={inst._id}>
              <td className="p-2 border">{inst.nombre}</td>
              <td className="p-2 border">{inst.correo}</td>
              <td className="p-2 border">{inst.especialidad || "N/A"}</td>
              <td className="p-2 border">{inst.esUsuario ? "Usuario registrado" : "Manual"}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => eliminarInstructor(inst._id, inst.esUsuario, inst.nombre)}
                  className={`px-2 py-1 rounded ${
                    inst.esUsuario 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {inst.esUsuario ? 'Remover' : 'Eliminar'}
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
