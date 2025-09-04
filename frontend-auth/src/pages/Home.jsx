import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiHeart, FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const storedUser = raw ? JSON.parse(raw) : null;
      if (storedUser) setUser(storedUser);
    } catch (_) {}

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    // Cargar cursos reales
    cargarCursos();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cargarCursos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cursos");
      setCursos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setLoading(false);
    }
  };

  const handleLike = async (cursoId) => {
    if (!user) {
      toast.info("Debes registrarte para dar like a los cursos");
      navigate("/register");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/cursos/${cursoId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar el curso en el estado local
      setCursos(prevCursos => 
        prevCursos.map(curso => 
          curso._id === cursoId 
            ? { 
                ...curso, 
                likes: response.data.hasLiked 
                  ? [...(curso.likes || []), { 
                      userId: user._id,
                      nombreUsuario: user.nombre,
                      emailUsuario: user.email || user.correo,
                      fechaLike: new Date()
                    }]
                  : (curso.likes || []).filter(like => like.userId !== user._id)
              }
            : curso
        )
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error al procesar like:", error);
      toast.error("Error al procesar like");
    }
  };

  const handleVerDetalles = (cursoId) => {
    if (!user) {
      toast.info("Debes registrarte para ver los detalles del curso");
      navigate("/register");
      return;
    }
    
    // Redirigir a mis cursos
    navigate("/dashboard/miscurso");
  };

  const isLiked = (curso) => {
    if (!user || !curso.likes) return false;
    return curso.likes.some(like => like.userId === user._id);
  };

  const getLikesCount = (curso) => {
    return curso.likes ? curso.likes.length : 0;
  };

  // Función para obtener cursos ordenados por likes
  const getCursosOrdenadosPorLikes = () => {
    return [...cursos].sort((a, b) => getLikesCount(b) - getLikesCount(a));
  };

  // Datos del componente
  const features = [
    { title: "Cursos Complementarios", description: "Amplía tus conocimientos con nuestra oferta educativa", icon: "📚" },
    { title: "Aprendizaje Práctico", description: "Metodología learning by doing con equipos modernos", icon: "🔧" },
    { title: "Certificación SENA", description: "Obtén certificados con validez nacional", icon: "🏅" }
  ];

  const filteredCursos = activeTab === "todos" ? cursos : cursos.filter(curso => curso.categoria === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Header con efecto vidrio y sombra */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-xl" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`p-2 rounded-lg transition-all ${isScrolled ? "bg-green-100/80" : "bg-white/90"}`}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                alt="SENA"
                className="h-8 transition-transform duration-300 group-hover:rotate-6"
                style={{ filter: 'hue-rotate(85deg) saturate(2)' }}
              />
            </div>
            <span className={`text-2xl font-bold transition-colors ${isScrolled ? "text-[var(--sg-green-700)]" : "text-white drop-shadow-lg"}`}>
              Sena Garzón
            </span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium rounded-lg transition-all ${isScrolled ? "text-gray-700 hover:text-[var(--sg-green-700)]" : "text-white hover:text-green-200"}`}
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl ${isScrolled ? "text-white" : "text-[var(--sg-green-700)] font-medium"}`}
                  style={isScrolled ? { background: "linear-gradient(135deg, var(--sg-green-800), var(--sg-green-600))" } : { background: "var(--sg-white)" }}
                >
                  Registrarse
                  <FiArrowRight className="ml-2 inline" />
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl ${isScrolled ? "text-white" : "text-[var(--sg-green-700)] font-medium"}`}
                style={isScrolled ? { background: "linear-gradient(135deg, var(--sg-green-800), var(--sg-green-600))" } : { background: "var(--sg-white)" }}
              >
                Mi Panel
                <FiArrowRight className="ml-2 inline" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero section con gradiente animado */}
      <div className="relative pt-32 pb-20 px-6 text-white overflow-hidden sg-gradient">
        {/* Efecto de burbujas decorativas */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(20px)",
                animation: `float ${Math.random() * 10 + 10}s infinite alternate`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Formación Técnica <span className="text-green-200 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">de Excelencia</span> en el Huila
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-lg">
              Centro de formación profesional que transforma vidas a través de la educación práctica y de calidad.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center transform hover:scale-105"
                >
                  Inscríbete Ahora
                  <FiArrowRight className="ml-2 animate-pulse" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center transform hover:scale-105"
                >
                  Acceder al Panel
                  <FiArrowRight className="ml-2 animate-pulse" />
                </Link>
              )}
              <a
                href="#cursos"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-all font-medium flex items-center hover:-translate-y-1"
              >
                Ver Cursos
                <FiArrowRight className="ml-2 animate-bounce" />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-full h-full border-4 border-white/30 rounded-2xl animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Estudiantes SENA"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de cursos con diseño mejorado */}
      <section id="cursos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Nuestros <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Cursos</span>
              </h2>
              <p className="text-gray-600">Programas diseñados para el desarrollo de competencias laborales</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 bg-gray-100 p-1 rounded-lg shadow-inner">
              {['todos', 'tecnologia', 'gastronomia', 'construccion', 'idiomas', 'moda'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab === 'todos' ? 'Todos' : 
                   tab === 'tecnologia' ? 'Tecnología' :
                   tab === 'gastronomia' ? 'Gastronomía' :
                   tab === 'construccion' ? 'Construcción' :
                   tab === 'idiomas' ? 'Idiomas' : 'Moda'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCursosOrdenadosPorLikes().map((curso, index) => (
              <div 
                key={curso._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 group relative"
              >
                {/* Badge de ranking */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg" style={{ background: "linear-gradient(135deg, var(--sg-green-800), var(--sg-green-600))" }}>
                    #{index + 1}
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <img 
                    src={curso.imagen || "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"} 
                    alt={curso.nombre} 
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <button 
                    onClick={() => handleLike(curso._id)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                      isLiked(curso)
                        ? "text-white shadow-lg" 
                        : "bg-white/90 text-gray-700 hover:bg-gray-100"
                    }`}
                    style={isLiked(curso) ? { background: "var(--sg-green-700)" } : {}}
                  >
                    <FiHeart className={`${isLiked(curso) ? "fill-current" : ""}`} />
                  </button>
                  <span className="absolute bottom-4 left-4 text-white text-xs px-2 py-1 rounded-full capitalize shadow-md"
                    style={{ background: "var(--sg-green-700)" }}>
                    {curso.categoria || 'general'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{curso.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-3">{curso.descripcion}</p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FiClock className="mr-1" />
                    <span className="text-sm">{curso.duracion || '120 horas'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm font-medium">
                        {getLikesCount(curso)} likes
                      </span>
                      {index === 0 && getLikesCount(curso) > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(20,138,82,0.12)", color: "var(--sg-green-700)" }}>
                          🏆 Más popular
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleVerDetalles(curso._id)}
                      className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition-colors group-hover:underline"
                    >
                      Ver detalles <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all transform hover:-translate-y-1"
                >
                  Registrarse para ver todos los cursos <FiArrowRight className="ml-2 animate-pulse" />
                </Link>
                <Link 
                  to="/top-cursos" 
                  className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 rounded-md text-base font-medium hover:bg-green-50 transition-all transform hover:-translate-y-1"
                >
                  Ver cursos más populares <FiArrowRight className="ml-2" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/dashboard/miscurso" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all transform hover:-translate-y-1"
                >
                  Ver mis cursos <FiArrowRight className="ml-2 animate-pulse" />
                </Link>
                <Link 
                  to="/top-cursos" 
                  className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 rounded-md text-base font-medium hover:bg-green-50 transition-all transform hover:-translate-y-1"
                >
                  Ver cursos más populares <FiArrowRight className="ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección de contacto con diseño profesional */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 text-white relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-green-500/20"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-green-500/20"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
                  <p className="mb-8 text-green-100">
                    Estamos aquí para responder tus preguntas sobre nuestros programas de formación.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-500 p-2 rounded-full mr-4 shadow-md">
                        <FiMapPin className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold">Ubicación</h4>
                        <p className="text-green-100">Carrera 12 # 10 - 45, Garzón, Huila</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-500 p-2 rounded-full mr-4 shadow-md">
                        <FiPhone className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold">Teléfono</h4>
                        <p className="text-green-100">(8) 833 1234 - Línea nacional: 018000 910270</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-500 p-2 rounded-full mr-4 shadow-md">
                        <FiMail className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold">Correo electrónico</h4>
                        <p className="text-green-100">contacto@sena-garzon.edu.co</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envía un mensaje</h3>
                <form className="space-y-4" onSubmit={async (e)=>{
                  e.preventDefault();
                  const nombre = e.currentTarget.name.value.trim();
                  const correo = e.currentTarget.email.value.trim();
                  const mensaje = e.currentTarget.message.value.trim();
                  if(!nombre || !correo || !mensaje){ toast.error("Completa todos los campos"); return; }
                  try{
                    await axios.post('http://localhost:5000/api/contact', { nombre, correo, mensaje });
                    toast.success('Mensaje enviado correctamente');
                    e.currentTarget.reset();
                  }catch(err){
                    console.error(err);
                    toast.error(err.response?.data?.message || 'No se pudo enviar el mensaje');
                  }
                }}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows="4" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-1"
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moderno */}
      <footer className="py-12 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                    alt="SENA"
                    className="h-8"
                    style={{ filter: 'hue-rotate(85deg) saturate(2)' }}
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  SENA Garzón
                </span>
              </div>
              <p className="text-gray-400">
                Centro de formación profesional comprometido con el desarrollo del Huila a través de la educación técnica.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-green-300 transition flex items-center">
                    <FiArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition" />
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/miscurso" className="text-gray-400 hover:text-green-300 transition flex items-center">
                    <FiArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition" />
                    Cursos
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="text-gray-400 hover:text-green-300 transition flex items-center">
                    <FiArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition" />
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <FiMapPin className="mt-1 mr-2 flex-shrink-0 text-green-300" />
                  Garzón, Huila
                </li>
                <li className="flex items-start">
                  <FiPhone className="mt-1 mr-2 flex-shrink-0 text-green-300" />
                  (8) 123 4567
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Centro de Formación SENA Garzón. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;