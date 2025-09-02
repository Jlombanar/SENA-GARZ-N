import React, { useState } from "react";
import { FaStar, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";

const InstructorEvaluaciones = () => {
  const [evaluaciones] = useState([
    {
      id: 1,
      titulo: "Evaluación Final - Programación Web",
      curso: "Programación Web",
      fecha: "2024-01-20",
      tipo: "Final",
      estado: "activa",
      estudiantesEvaluados: 15,
      promedio: 4.2,
      peso: 40
    },
    {
      id: 2,
      titulo: "Quiz Semanal - HTML/CSS",
      curso: "Programación Web",
      fecha: "2024-01-15",
      tipo: "Quiz",
      estado: "completada",
      estudiantesEvaluados: 18,
      promedio: 3.8,
      peso: 15
    },
    {
      id: 3,
      titulo: "Proyecto Individual - Portfolio",
      curso: "Programación Web",
      fecha: "2024-01-25",
      tipo: "Proyecto",
      estado: "pendiente",
      estudiantesEvaluados: 0,
      promedio: 0,
      peso: 25
    }
  ]);

  const [filter, setFilter] = useState("todos");

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activa": return "bg-green-100 text-green-800";
      case "completada": return "bg-blue-100 text-blue-800";
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "Final": return "bg-red-100 text-red-800";
      case "Quiz": return "bg-purple-100 text-purple-800";
      case "Proyecto": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvaluaciones = evaluaciones.filter(evaluacion => {
    if (filter === "todos") return true;
    if (filter === "activas") return evaluacion.estado === "activa";
    if (filter === "completadas") return evaluacion.estado === "completada";
    if (filter === "pendientes") return evaluacion.estado === "pendiente";
    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FaStar className="mr-3 text-green-600" />
            Gestión de Evaluaciones
          </h1>
          <p className="text-gray-600">
            Crea, administra y revisa las evaluaciones de tus cursos
          </p>
        </div>

        {/* Controles y filtros */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "todos", label: "Todas", count: evaluaciones.length },
              { key: "activas", label: "Activas", count: evaluaciones.filter(e => e.estado === "activa").length },
              { key: "completadas", label: "Completadas", count: evaluaciones.filter(e => e.estado === "completada").length },
              { key: "pendientes", label: "Pendientes", count: evaluaciones.filter(e => e.estado === "pendiente").length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === key
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <FaPlus size={14} />
            Nueva Evaluación
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {evaluaciones.length}
            </div>
            <div className="text-sm text-gray-600">Total Evaluaciones</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {evaluaciones.filter(e => e.estado === "activa").length}
            </div>
            <div className="text-sm text-gray-600">Evaluaciones Activas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {evaluaciones.reduce((total, e) => total + e.estudiantesEvaluados, 0)}
            </div>
            <div className="text-sm text-gray-600">Estudiantes Evaluados</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {(evaluaciones.reduce((total, e) => total + e.promedio, 0) / evaluaciones.filter(e => e.promedio > 0).length).toFixed(1) || 0}
            </div>
            <div className="text-sm text-gray-600">Promedio General</div>
          </div>
        </div>

        {/* Lista de evaluaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredEvaluaciones.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay evaluaciones para mostrar</p>
              <p className="text-gray-400 text-sm">Crea tu primera evaluación para comenzar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rendimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvaluaciones.map((evaluacion) => (
                    <tr key={evaluacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {evaluacion.titulo}
                          </div>
                          <div className="text-sm text-gray-500">
                            Peso: {evaluacion.peso}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{evaluacion.curso}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(evaluacion.tipo)}`}>
                          {evaluacion.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(evaluacion.estado)}`}>
                          {evaluacion.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(evaluacion.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(evaluacion.promedio)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {evaluacion.promedio > 0 ? evaluacion.promedio.toFixed(1) : "N/A"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {evaluacion.estudiantesEvaluados} estudiantes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1" title="Ver detalles">
                            <FaEye size={16} />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1" title="Editar">
                            <FaEdit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1" title="Eliminar">
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorEvaluaciones;
