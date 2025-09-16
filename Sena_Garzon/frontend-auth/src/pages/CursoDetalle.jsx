  // src/pages/CursoDetalle.jsx

  import { useState, useEffect } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { getCursoById } from '../services/cursoService'; // Asumimos que esta función existirá
  import { FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
  import { toast } from 'react-toastify';

  const CursoDetalle = () => {
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cursoId } = useParams(); // Obtiene el ID del curso desde la URL (ej: /cursos/12345)

    useEffect(() => {
      const fetchCurso = async () => {
        try {
          setLoading(true);
          const res = await getCursoById(cursoId);
          setCurso(res.data);
        } catch (error) {
          console.error("Error al cargar el curso:", error);
          toast.error('No se pudo cargar la información del curso.');
        } finally {
          setLoading(false);
        }
      };

      fetchCurso();
    }, [cursoId]);

    if (loading) {
      return <div className="text-center p-10">Cargando detalles del curso...</div>;
    }

    if (!curso) {
      return <div className="text-center p-10">Curso no encontrado.</div>;
    }
    
    // Función para calcular cupos disponibles (la misma que tienes en InstructorCursos)
    const calcularCuposDisponibles = (c) => {
      const inscritosAprobados = c.inscritos?.filter(i => i.estado === 'aprobada').length || 0;
      return c.cantidad - inscritosAprobados;
    };

    const cuposDisponibles = calcularCuposDisponibles(curso);

    return (
      <div className="container mx-auto p-6 mt-10 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <img 
            src={curso.imagen} 
            alt={`Imagen de ${curso.nombre}`}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h1 className="text-4xl font-bold text-green-800 mb-4">{curso.nombre}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {curso.descripcion}
            </p>

            {curso.informacionAdicional && (
              <div className="mb-8 p-5 bg-green-50 rounded-xl border border-green-200">
                <h2 className="text-2xl font-semibold text-green-800 mb-3">Más información</h2>
                <p className="text-gray-700 whitespace-pre-line">{curso.informacionAdicional}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-b py-6">
              <div className="flex items-center text-gray-700">
                <FaUsers className="text-2xl text-green-600 mr-3" />
                <div>
                  <span className="font-semibold">Cupos Totales</span>
                  <p className="text-lg">{curso.cantidad}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaCheckCircle className={`text-2xl mr-3 ${cuposDisponibles > 0 ? 'text-blue-600' : 'text-red-600'}`} />
                <div>
                  <span className="font-semibold">Cupos Disponibles</span>
                  <p className={`text-lg font-bold ${cuposDisponibles > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {cuposDisponibles}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <FaClock className="text-2xl text-green-600 mr-3" />
                <div>
                  <span className="font-semibold">Inscripción</span>
                  <p className="text-lg">Gratis</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              {/* Este botón podría llevar a la página de inscripción o login */}
              <Link 
                to={cuposDisponibles > 0 ? `/?inscribir=${curso._id}` : '#'} 
                className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-transform duration-200 ${
                  cuposDisponibles > 0 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={cuposDisponibles <= 0}
              >
                {cuposDisponibles > 0 ? 'Inscribirme ahora' : 'Cupos agotados'}
              </Link>
              <Link 
                to="/" 
                className="px-8 py-3 rounded-xl text-green-700 font-bold bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CursoDetalle;