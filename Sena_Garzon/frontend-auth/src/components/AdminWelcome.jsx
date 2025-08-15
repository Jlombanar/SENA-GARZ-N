import React, { useRef, useEffect, useState } from "react";
import { FaUsers, FaBook, FaChalkboardTeacher, FaChartBar, FaCog, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminWelcome = () => {
  const reportesRef = useRef(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalInstructores: 0,
    totalCursos: 0,
    totalInscripciones: 0,
    totalLikes: 0,
    pendientes: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorNotifications, setErrorStats] = useState(null);
  const [migrando, setMigrando] = useState(false);

  const fetchStats = async () => {
    try {
      setErrorStats(null);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setErrorStats(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setErrorNotifications(null);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar notificaciones');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setErrorNotifications(err.message);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const migrarInstructores = async () => {
    try {
      setMigrando(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/admin/migrar-instructores', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al migrar instructores');
      
      const data = await res.json();
      alert(`Migración completada: ${data.migrados} instructores migrados de ${data.total} encontrados.`);
      
      // Recargar estadísticas después de la migración
      fetchStats();
      fetchNotifications();
    } catch (err) {
      alert(`Error en migración: ${err.message}`);
    } finally {
      setMigrando(false);
    }
  };

  // Funciones para navegar desde las tarjetas de estadísticas
  const handleStatsClick = (type) => {
    switch (type) {
      case 'usuarios':
        navigate('/admin/users');
        break;
      case 'cursos':
        navigate('/admin/cursos');
        break;
      case 'instructores':
        navigate('/admin/instructores');
        break;
      case 'inscripciones':
        navigate('/admin/cursos');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (window.location.hash === '#reportes' && reportesRef.current) {
      reportesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchNotifications();
    const interval = setInterval(() => {
      fetchStats();
      fetchNotifications();
    }, 10000); // 10s
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: "Gestionar Usuarios",
      description: "Ver, editar y administrar usuarios del sistema",
      icon: FaUsers,
      color: "bg-blue-100 text-blue-600",
      href: "/admin/users"
    },
    {
      title: "Gestionar Cursos",
      description: "Crear, editar y administrar cursos",
      icon: FaBook,
      color: "bg-green-100 text-green-600",
      href: "/admin/cursos"
    },
    {
      title: "Gestionar Instructores",
      description: "Administrar instructores y sus permisos",
      icon: FaChalkboardTeacher,
      color: "bg-purple-100 text-purple-600",
      href: "/admin/instructores"
    },
    {
      title: "Ver Reportes",
      description: "Analizar estadísticas y métricas",
      icon: FaChartBar,
      color: "bg-orange-100 text-orange-600",
      href: "/admin#reportes"
    }
  ];

  return (
    <div className="w-full">
      {/* Header de bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido al Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona usuarios, cursos, instructores y monitorea el rendimiento del sistema
        </p>
        
        {/* Botón de migración temporal */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Migración de Instructores</h3>
          <p className="text-yellow-700 mb-3">
            Si tienes instructores en la colección "users", puedes migrarlos a la colección "instructors" para que aparezcan correctamente.
          </p>
          <button
            onClick={migrarInstructores}
            disabled={migrando}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrando ? '🔄 Migrando...' : '🚀 Migrar Instructores Existentes'}
          </button>
        </div>
      </div>

      {/* Estadísticas principales - Ahora son botones funcionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button 
          onClick={() => handleStatsClick('usuarios')}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-blue-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
            </div>
            <div className={`p-3 rounded-full bg-blue-500 text-white`}>
              <FaUsers className="w-6 h-6" />
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => handleStatsClick('cursos')}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-green-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCursos}</p>
            </div>
            <div className={`p-3 rounded-full bg-green-500 text-white`}>
              <FaBook className="w-6 h-6" />
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => handleStatsClick('instructores')}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-purple-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Instructores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInstructores}</p>
            </div>
            <div className={`p-3 rounded-full bg-purple-500 text-white`}>
              <FaChalkboardTeacher className="w-6 h-6" />
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => handleStatsClick('inscripciones')}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-orange-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inscripciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInscripciones}</p>
            </div>
            <div className={`p-3 rounded-full bg-orange-500 text-white`}>
              <FaChartBar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Pendientes: <span className="font-semibold">{stats.pendientes}</span>
          </div>
        </button>
      </div>

      {errorStats && (
        <div className="mb-6 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {errorStats}
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className={`p-3 rounded-full ${action.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Notificaciones recientes - Ahora son reales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaBell className="mr-2 text-gray-500" />
            Notificaciones Recientes
          </h2>
          <button 
            onClick={fetchNotifications}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            🔄 Actualizar
          </button>
        </div>
        
        {errorNotifications && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
            {errorNotifications}
          </div>
        )}

        {loadingNotifications ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Cargando notificaciones...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start space-x-3 p-3 ${notification.color} rounded-lg`}>
                <div className={`w-2 h-2 ${notification.iconColor} rounded-full mt-2`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{notification.titulo}</p>
                  <p className="text-xs text-gray-600">{notification.descripcion}</p>
                  <p className="text-xs text-gray-500">{notification.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No hay notificaciones recientes</p>
          </div>
        )}
      </div>

      {/* Reportes dentro del Dashboard */}
      <div ref={reportesRef} id="reportes" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaChartBar className="mr-2 text-orange-500" />
          Reportes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Resumen General</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Usuarios: {stats.totalUsuarios}</li>
              <li>Cursos: {stats.totalCursos}</li>
              <li>Inscripciones: {stats.totalInscripciones} (Pendientes: {stats.pendientes})</li>
              <li>Likes: {stats.totalLikes}</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Detalle Instructores</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Total instructores: {stats.totalInstructores}</li>
              <li>Promedio inscripciones por curso (aprox): {stats.totalCursos ? Math.round(stats.totalInscripciones / stats.totalCursos) : 0}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;
