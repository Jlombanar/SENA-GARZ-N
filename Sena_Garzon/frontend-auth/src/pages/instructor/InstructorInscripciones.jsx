import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const InstructorInscripciones = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const cursosSimulados = [
        { _id: '1', nombre: 'Curso de React', inscritos: 3 },
        { _id: '2', nombre: 'Curso de Node.js', inscritos: 2 }
      ];
      setCursos(cursosSimulados);
      setSelectedCurso(cursosSimulados[0]);
      
      const inscripcionesSimuladas = [
        {
          _id: '1',
          nombreCompleto: 'Juan Pérez',
          correo: 'juan@email.com',
          telefono: '3001234567',
          documentoIdentidad: '12345678',
          fechaInscripcion: new Date(),
          numeroTarjeta: '1234-5678-9012-3456',
          direccion: 'Calle 123 #45-67',
          estado: 'pendiente'
        },
        {
          _id: '2',
          nombreCompleto: 'María García',
          correo: 'maria@email.com',
          telefono: '3009876543',
          documentoIdentidad: '87654321',
          fechaInscripcion: new Date(),
          numeroTarjeta: '9876-5432-1098-7654',
          direccion: 'Avenida 456 #78-90',
          estado: 'aprobada'
        }
      ];
      setInscripciones(inscripcionesSimuladas);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCursoChange = (cursoId) => {
    const curso = cursos.find(c => c._id === cursoId);
    setSelectedCurso(curso);
  };

  const handleAprobar = (inscripcionId) => {
    setInscripciones(prev => 
      prev.map(ins => 
        ins._id === inscripcionId 
          ? { ...ins, estado: 'aprobada' }
          : ins
      )
    );
    toast.success('Inscripción aprobada exitosamente');
  };

  const handleRechazar = (inscripcionId) => {
    setInscripciones(prev => 
      prev.map(ins => 
        ins._id === inscripcionId 
          ? { ...ins, estado: 'rechazada' }
          : ins
      )
    );
    toast.success('Inscripción rechazada exitosamente');
  };

  const handleEliminar = (inscripcionId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta inscripción?")) {
      setInscripciones(prev => prev.filter(ins => ins._id !== inscripcionId));
      toast.success('Inscripción eliminada exitosamente');
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "aprobada": return "bg-green-100 text-green-800";
      case "rechazada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "pendiente": return "⏰";
      case "aprobada": return "✅";
      case "rechazada": return "❌";
      default: return "⏰";
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando inscripciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Gestión de Inscripciones</h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {cursos.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl">👥</span>
          <p className="text-gray-500 text-lg mb-2">No tienes cursos disponibles</p>
          <p className="text-gray-400 text-sm">Crea un curso para ver las inscripciones</p>
        </div>
      ) : (
        <>
          {/* Selector de curso */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Curso:
            </label>
            <select
              value={selectedCurso?._id || ""}
              onChange={(e) => handleCursoChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {cursos.map((curso) => (
                <option key={curso._id} value={curso._id}>
                  {curso.nombre} - {curso.inscritos} inscripciones
                </option>
              ))}
            </select>
          </div>

          {/* Lista de inscripciones */}
          {inscripciones.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">👥</span>
              <p className="text-gray-500 text-lg mb-2">No hay inscripciones</p>
              <p className="text-gray-400 text-sm">Aún no hay inscripciones para este curso</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inscripciones.map((inscripcion) => (
                <div key={inscripcion._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inscripcion.nombreCompleto}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(inscripcion.estado)}`}>
                          {getStatusIcon(inscripcion.estado)}
                          {inscripcion.estado}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Email:</strong> {inscripcion.correo}</p>
                          <p><strong>Teléfono:</strong> {inscripcion.telefono}</p>
                          <p><strong>Documento:</strong> {inscripcion.documentoIdentidad}</p>
                        </div>
                        <div>
                          <p><strong>Fecha de inscripción:</strong> {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}</p>
                          <p><strong>Número de tarjeta:</strong> {inscripcion.numeroTarjeta}</p>
                          <p><strong>Dirección:</strong> {inscripcion.direccion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleEliminar(inscripcion._id)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  {inscripcion.estado === "pendiente" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAprobar(inscripcion._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Aprobar
                      </button>
                      <button
                        onClick={() => handleRechazar(inscripcion._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstructorInscripciones;

