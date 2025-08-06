// src/pages/user/InscribirseCurso.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { inscribirseCurso } from "../../services/cursoService";
import { toast } from "react-toastify";

const InscribirseCurso = () => {
  const { id } = useParams(); // ID del curso desde la URL
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [tarjetaPDFUrl, setTarjetaPDFUrl] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inscribirseCurso(id, { numeroTarjeta, tarjetaPDFUrl }, token);
      toast.success("Te has inscrito correctamente");
      setNumeroTarjeta("");
      setTarjetaPDFUrl("");
    } catch (err) {
      toast.error("Error al inscribirse");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Inscribirse al Curso</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Número de Tarjeta</label>
          <input
            type="text"
            value={numeroTarjeta}
            onChange={(e) => setNumeroTarjeta(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">URL de la Tarjeta en PDF</label>
          <input
            type="text"
            value={tarjetaPDFUrl}
            onChange={(e) => setTarjetaPDFUrl(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="https://..."
            required
          />
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          Enviar inscripción
        </button>
      </form>
    </div>
  );
};

export default InscribirseCurso;
