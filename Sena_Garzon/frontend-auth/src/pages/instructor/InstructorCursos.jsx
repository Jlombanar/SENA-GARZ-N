// src/pages/instructor/InstructorCursos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InstructorCursos = () => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/cursos/mios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCursos(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar los cursos del instructor");
      }
    };

    fetchCursos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Mis Cursos</h2>
      <ul className="space-y-2">
        {cursos.map((curso) => (
          <li key={curso._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{curso.nombre}</h3>
            <p>Cantidad: {curso.cantidad}</p>
            <p>Valor: ${curso.valor}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorCursos;
