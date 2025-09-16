import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiArrowRight, FiTrendingUp, FiUsers, FiClock } from "react-icons/fi";
import { getCursosPorLikes } from "../services/cursoService";
import { toast } from "react-toastify";

const TopCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [user] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  useEffect(() => {
    cargarTopCursos();
    cargarEstadisticas();
  }, []);

  const cargarTopCursos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await getCursosPorLikes(token);
        setCursos(response);
      } else {
        // Si no hay token, hacer petición pública
        const response = await fetch("http://localhost:5000/api/cursos/top-likes");
        const data = await response.json();
        setCursos(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      toast.error("Error al cargar los cursos más populares");
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cursos/estadisticas-likes");
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const isLiked = (curso) => {
    if (!user || !curso.likes) return false;
    return curso.likes.some(like => like.userId === user?._id);
  };

  const getLikesCount = (curso) => {
    return curso.likes ? curso.likes.length : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos más populares...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <FiTrendingUp className="text-4xl mr-3" />
            <h1 className="text-4xl font-bold">Cursos Más Populares</h1>
          </div>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Descubre los cursos más valorados por nuestra comunidad de aprendices
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {estadisticas?.estadisticas?.totalCursos || cursos.length}
            </div>
            <div className="text-gray-600">Cursos Disponibles</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {estadisticas?.estadisticas?.totalLikes || cursos.reduce((total, curso) => total + getLikesCount(curso), 0)}
            </div>
            <div className="text-gray-600">Total de Likes</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {estadisticas?.estadisticas?.promedioLikes ? 
                Math.round(estadisticas.estadisticas.promedioLikes) : 
                (cursos.length > 0 ? Math.round(cursos.reduce((total, curso) => total + getLikesCount(curso), 0) / cursos.length) : 0)
              }
            </div>
            <div className="text-gray-600">Promedio de Likes</div>
          </div>
        </div>
        
        {/* Estadísticas adicionales */}
        {estadisticas && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">📊 Estadísticas Detalladas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Curso con más likes:</span>
                  <span className="font-semibold text-green-600">{estadisticas.estadisticas.cursoConMasLikes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Curso con menos likes:</span>
                  <span className="font-semibold text-red-600">{estadisticas.estadisticas.cursoConMenosLikes || 0}</span>
                </div>
                {estadisticas.cursoTop && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>🏆 Curso más popular:</strong> {estadisticas.cursoTop.nombre} 
                      ({estadisticas.cursoTop.likesCount} likes)
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🎯 Ranking Actual</h3>
              <div className="space-y-2">
                {cursos.slice(0, 5).map((curso, index) => (
                  <div key={curso._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800 truncate max-w-32">
                        {curso.nombre}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-red-500">
                      {getLikesCount(curso)} ❤️
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de cursos */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((curso, index) => (
            <div 
              key={curso._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 group"
            >
              {/* Badge de ranking */}
              <div className="relative">
                <img 
                  src={curso.imagen || "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"} 
                  alt={curso.nombre} 
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Ranking badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                  #{index + 1}
                </div>
                
                {/* Likes badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center">
                  <FiHeart className="mr-1 fill-current" />
                  {getLikesCount(curso)}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{curso.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4">{curso.descripcion}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiUsers className="mr-2" />
                    <span>Cupos: {curso.cantidad}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiClock className="mr-2" />
                    <span>Duración: {curso.duracion || '120 horas'}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiTrendingUp className="mr-2" />
                    <span>Valor: ${curso.valor?.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {curso.categoria || 'General'}
                  </div>
                  
                  <Link 
                    to={`/cursos/${curso._id}`}
                    className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition-colors group-hover:underline"
                  >
                    Ver detalles <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cursos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">No hay cursos disponibles</p>
            <p className="text-gray-400 text-sm">Los cursos aparecerán aquí cuando estén disponibles</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Te gustan estos cursos?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y accede a todos los cursos disponibles
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Registrarse Ahora
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-700 transition-all font-medium"
                >
                  Ya tengo cuenta
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard/miscurso"
                className="px-8 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Ver mis cursos
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCursos;

