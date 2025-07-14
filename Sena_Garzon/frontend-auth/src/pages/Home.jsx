import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiHeart, FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

// Color verde oficial del SENA
const SENA_GREEN = '#3C8A34';

const Home = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = (courseId) => {
    setLikes(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const features = [
    {
      title: "Cursos Complementarios",
      description: "Amplía tus conocimientos con nuestra oferta educativa",
      icon: "📚"
    },
    {
      title: "Aprendizaje Práctico",
      description: "Metodología learning by doing con equipos modernos",
      icon: "🔧"
    },
    {
      title: "Certificación SENA",
      description: "Obtén certificados con validez nacional",
      icon: "🏅"
    }
  ];

  const popularCourses = [
    {
      id: 1,
      title: "Diseño Gráfico Digital",
      category: "tecnologia",
      duration: "120 horas",
      likes: 124,
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Panadería Artesanal",
      category: "gastronomia",
      duration: "80 horas",
      likes: 98,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Educacion Sexual",
      category: "tecnologia",
      duration: "160 horas",
      likes: 156,
      image: "https://www.viapais.com.ar/resizer/v2/MMZTONBVMI2TEMBTMNSTIZRTMQ.jpg?quality=75&smart=true&auth=beac066b1b73eac681ead096f064679b6ac2a79edf4b2951c4036496bb94e288&width=980&height=640"
    },
    {
      id: 4,
      title: "Electricidad Residencial",
      category: "construccion",
      duration: "100 horas",
      likes: 87,
      image: "https://images.unsplash.com/photo-1506790409786-287062b21cfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      title: "Inglés Básico",
      category: "idiomas",
      duration: "120 horas",
      likes: 210,
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      title: "Corte y Confección",
      category: "moda",
      duration: "140 horas",
      likes: 76,
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "El SENA Garzón me dio las herramientas para montar mi propio negocio. Hoy tengo una panadería que da empleo a 3 personas más.",
      author: "María Fernanda",
      role: "Egresada de Panadería",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      quote: "Gracias al curso de programación conseguí mi primer empleo en una empresa de desarrollo de software en Neiva.",
      author: "Carlos Andrés",
      role: "Egresado de Programación",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  const filteredCourses = activeTab === "todos" 
    ? popularCourses 
    : popularCourses.filter(course => course.category === activeTab);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header con color verde SENA */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? `bg-[${SENA_GREEN}] shadow-md` : `bg-[${SENA_GREEN}]`}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-2 rounded-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                alt="SENA"
                className="h-8 transition-transform duration-300 group-hover:rotate-6"
              />
            </div>
            <span className="text-2xl font-bold text-white">SENA Garzón</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white font-medium hover:text-gray-200 transition-colors rounded-lg"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-[${SENA_GREEN}] rounded-lg hover:bg-gray-100 transition-colors shadow hover:shadow-md flex items-center"
                >
                  Registrarse
                  <FiArrowRight className="ml-2" />
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white text-[${SENA_GREEN}] rounded-lg hover:bg-gray-100 transition-colors shadow hover:shadow-md flex items-center"
              >
                Mi Panel
                <FiArrowRight className="ml-2" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero section con fondo verde SENA */}
      <div className={`relative pt-32 pb-20 px-6 bg-[${SENA_GREEN}] text-white`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Formación Técnica de Excelencia en el Huila
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Centro de formación profesional que transforma vidas a través de la educación.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <Link
                  to="/register"
                  className={`px-6 py-3 bg-white text-[${SENA_GREEN}] rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center`}
                >
                  Inscríbete Ahora
                  <FiArrowRight className="ml-2" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={`px-6 py-3 bg-white text-[${SENA_GREEN}] rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center`}
                >
                  Acceder al Panel
                  <FiArrowRight className="ml-2" />
                </Link>
              )}
              <a
                href="#cursos"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium flex items-center"
              >
                Ver Cursos
                <FiArrowRight className="ml-2" />
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


      <section id="cursos" className={`py-16 bg-[${SENA_GREEN}]/10`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Cursos destacados</h2>
              <p className="text-gray-600">Los programas más solicitados por nuestros estudiantes</p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0 bg-white p-1 rounded-lg shadow-inner">
              <button 
                onClick={() => setActiveTab("todos")}
                className={`px-4 py-2 rounded-md ${activeTab === "todos" ? `bg-[${SENA_GREEN}] text-white` : "text-gray-700"}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setActiveTab("tecnologia")}
                className={`px-4 py-2 rounded-md ${activeTab === "tecnologia" ? `bg-[${SENA_GREEN}] text-white` : "text-gray-700"}`}
              >
                Tecnología
              </button>
              <button 
                onClick={() => setActiveTab("gastronomia")}
                className={`px-4 py-2 rounded-md ${activeTab === "gastronomia" ? `bg-[${SENA_GREEN}] text-white` : "text-gray-700"}`}
              >
                Gastronomía
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div 
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={() => handleLike(course.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full ${likes[course.id] ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
                  >
                    <FiHeart className={`${likes[course.id] ? "fill-current" : ""}`} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <span className={`bg-[${SENA_GREEN}]/10 text-[${SENA_GREEN}] text-xs px-2 py-1 rounded-full`}>{course.category}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FiClock className="mr-1" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{course.likes + (likes[course.id] ? 1 : 0)} likes</span>
                    <Link 
                      to={`/curso/${course.id}`} 
                      className={`text-[${SENA_GREEN}] hover:text-[#2d6a28] font-medium text-sm flex items-center`}
                    >
                      Ver detalles <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/cursos" 
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[${SENA_GREEN}] hover:bg-[#2d6a28] transition-colors`}
            >
              Ver todos los cursos <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

    

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`bg-[${SENA_GREEN}] rounded-2xl shadow-2xl overflow-hidden`}>
            <div className="grid md:grid-cols-2">
              <div className="p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">Contáctanos</h2>
                <p className="mb-8">Estamos aquí para responder tus preguntas sobre nuestros programas de formación.</p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <FiMapPin className="text-xl mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">Ubicación</h4>
                      <p>Carrera 12 # 10 - 45, Garzón, Huila</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiPhone className="text-xl mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">Teléfono</h4>
                      <p>(8) 833 1234 - Línea nacional: 018000 910270</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMail className="text-xl mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">Correo electrónico</h4>
                      <p>contacto@sena-garzon.edu.co</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envía un mensaje</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[${SENA_GREEN}] focus:border-[${SENA_GREEN}]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[${SENA_GREEN}] focus:border-[${SENA_GREEN}]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[${SENA_GREEN}] focus:border-[${SENA_GREEN}]"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[${SENA_GREEN}] hover:bg-[#2d6a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${SENA_GREEN}]`}
                  >
                    Enviar mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer completo */}
      <footer className={`py-12 bg-[${SENA_GREEN}] text-white`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                    alt="SENA"
                    className="h-8"
                  />
                </div>
                <span className="text-xl font-bold">SENA Garzón</span>
              </div>
              <p className="text-white/90">
                Centro de formación profesional comprometido con el desarrollo del Huila a través de la educación técnica.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/90 hover:text-white transition">Inicio</Link></li>
                <li><Link to="/cursos" className="text-white/90 hover:text-white transition">Cursos</Link></li>
                <li><Link to="/contacto" className="text-white/90 hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-start">
                  <FiMapPin className="mt-1 mr-2 flex-shrink-0" />
                  Garzón, Huila
                </li>
                <li className="flex items-start">
                  <FiPhone className="mt-1 mr-2 flex-shrink-0" />
                  (8) 123 4567
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/90">
            <p>© {new Date().getFullYear()} Centro de Formación SENA Garzón. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;