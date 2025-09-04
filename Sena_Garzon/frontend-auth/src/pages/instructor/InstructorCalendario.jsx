import React, { useState } from "react";
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const InstructorCalendario = () => {
  const [currentDate] = useState(new Date());
  const [events] = useState([
    {
      id: 1,
      title: "Clase de Programación Web",
      date: "2024-01-15",
      time: "09:00",
      duration: "2 horas",
      location: "Aula 101",
      type: "clase"
    },
    {
      id: 2,
      title: "Revisión de Proyectos",
      date: "2024-01-16",
      time: "14:00",
      duration: "1 hora",
      location: "Oficina",
      type: "revision"
    },
    {
      id: 3,
      title: "Evaluación Final",
      date: "2024-01-20",
      time: "10:00",
      duration: "3 horas",
      location: "Laboratorio",
      type: "evaluacion"
    }
  ]);

  const getEventTypeColor = (type) => {
    switch (type) {
      case "clase": return "bg-blue-100 text-blue-800";
      case "revision": return "bg-green-100 text-green-800";
      case "evaluacion": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "clase": return "📚";
      case "revision": return "📝";
      case "evaluacion": return "📊";
      default: return "📅";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FaCalendarAlt className="mr-3 text-green-600" />
            Calendario de Actividades
          </h1>
          <p className="text-gray-600">
            Organiza y gestiona tu agenda de clases, evaluaciones y actividades
          </p>
        </div>

        {/* Controles del calendario */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <FaPlus size={14} />
            Agregar Evento
          </button>
        </div>

        {/* Vista del calendario */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendario mensual */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => {
                const dayNumber = i + 1;
                const dayEvents = events.filter(event => 
                  new Date(event.date).getDate() === dayNumber
                );
                
                return (
                  <div key={dayNumber} className="min-h-[80px] p-2 border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {dayNumber}
                    </div>
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded mb-1 cursor-pointer ${getEventTypeColor(event.type)}`}
                        title={`${event.title} - ${event.time}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de eventos próximos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos Próximos</h3>
            
            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay eventos programados</p>
            ) : (
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                          <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt size={12} />
                          <span>{new Date(event.date).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock size={12} />
                          <span>{event.time} ({event.duration})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt size={12} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button className="text-blue-600 hover:text-blue-800 text-xs p-1">
                          <FaEdit size={12} />
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-xs p-1">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {events.filter(e => e.type === 'clase').length}
            </div>
            <div className="text-sm text-gray-600">Clases Programadas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {events.filter(e => e.type === 'revision').length}
            </div>
            <div className="text-sm text-gray-600">Revisiones</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {events.filter(e => e.type === 'evaluacion').length}
            </div>
            <div className="text-sm text-gray-600">Evaluaciones</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {events.length}
            </div>
            <div className="text-sm text-gray-600">Total Eventos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCalendario;
