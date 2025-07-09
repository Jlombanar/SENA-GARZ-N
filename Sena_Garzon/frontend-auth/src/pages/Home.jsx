import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiHeart, FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

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
      title: "Programación Básica",
      category: "tecnologia",
      duration: "160 horas",
      likes: 156,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
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
      {/* Header moderno con efecto glass */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-[#0B5ED7] p-2 rounded-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                alt="SENA"
                className="h-8 transition-transform duration-300 group-hover:rotate-6"
              />
            </div>
            <span className="text-2xl font-bold text-gray-800">SENA Garzón</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#0B5ED7] font-medium hover:text-[#0a4eb6] transition-colors rounded-lg"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#0B5ED7] text-white rounded-lg hover:bg-[#0a4eb6] transition-colors shadow hover:shadow-md flex items-center"
                >
                  Registrarse
                  <FiArrowRight className="ml-2" />
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-[#0B5ED7] text-white rounded-lg hover:bg-[#0a4eb6] transition-colors shadow hover:shadow-md flex items-center"
              >
                Mi Panel
                <FiArrowRight className="ml-2" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero section con animación */}
      <div className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-[#0B5ED7]/10 to-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transforma tu futuro con <span className="text-[#0B5ED7]">formación</span> de calidad
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Centro de formación profesional que transforma vidas a través de la educación técnica en el Huila.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <Link
                  to="/register"
                  className="px-6 py-3 bg-[#0B5ED7] text-white rounded-lg hover:bg-[#0a4eb6] transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center"
                >
                  Inscríbete Ahora
                  <FiArrowRight className="ml-2" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-[#0B5ED7] text-white rounded-lg hover:bg-[#0a4eb6] transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center"
                >
                  Acceder al Panel
                  <FiArrowRight className="ml-2" />
                </Link>
              )}
              <a
                href="#cursos"
                className="px-6 py-3 border-2 border-[#0B5ED7] text-[#0B5ED7] rounded-lg hover:bg-[#0B5ED7]/10 transition-colors font-medium flex items-center"
              >
                Ver Cursos
                <FiArrowRight className="ml-2" />
              </a>
            </div>
            
          
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-full h-full border-4 border-[#0B5ED7]/30 rounded-2xl animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Estudiantes SENA"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Banner promocional */}
      <div className="bg-gradient-to-r from-[#0B5ED7] to-[#F7941D] py-6 px-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
          </div>
         
        </div>
      </div>

     

      {/* Sección de cursos populares */}
      <section id="cursos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Cursos <span className="text-[#0B5ED7]">destacados</span></h2>

            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0 bg-white p-1 rounded-lg shadow-inner">
              <button 
                onClick={() => setActiveTab("todos")}
                className={`px-4 py-2 rounded-md ${activeTab === "todos" ? "bg-[#0B5ED7] text-white" : "text-gray-700"}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setActiveTab("tecnologia")}
                className={`px-4 py-2 rounded-md ${activeTab === "tecnologia" ? "bg-[#0B5ED7] text-white" : "text-gray-700"}`}
              >
                Tecnología
              </button>
              <button 
                onClick={() => setActiveTab("gastronomia")}
                className={`px-4 py-2 rounded-md ${activeTab === "gastronomia" ? "bg-[#0B5ED7] text-white" : "text-gray-700"}`}
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
                    <span className="bg-[#0B5ED7]/10 text-[#0B5ED7] text-xs px-2 py-1 rounded-full">{course.category}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FiClock className="mr-1" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{course.likes + (likes[course.id] ? 1 : 0)} likes</span>
                    <Link 
                      to={`/curso/${course.id}`} 
                      className="text-[#0B5ED7] hover:text-[#0a4eb6] font-medium text-sm flex items-center"
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
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0B5ED7] hover:bg-[#0a4eb6] transition-colors"
            >
              Ver todos los cursos <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#0B5ED7] to-[#F7941D] rounded-2xl shadow-2xl overflow-hidden">
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B5ED7] focus:border-[#0B5ED7]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B5ED7] focus:border-[#0B5ED7]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B5ED7] focus:border-[#0B5ED7]"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0B5ED7] hover:bg-[#0a4eb6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B5ED7]"
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
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#0B5ED7] p-2 rounded-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                    alt="SENA"
                    className="h-8"
                  />
                </div>
                <span className="text-xl font-bold">SENA Garzón</span>
              </div>
              <p className="text-gray-400 mb-4">
                Centro de formación profesional comprometido con el desarrollo del Huila a través de la educación técnica.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Inicio</Link></li>
                <li><Link to="/cursos" className="text-gray-400 hover:text-white transition">Cursos</Link></li>
                <li><Link to="/inscripciones" className="text-gray-400 hover:text-white transition">Inscripciones</Link></li>
                <li><Link to="/noticias" className="text-gray-400 hover:text-white transition">Noticias</Link></li>
                <li><Link to="/contacto" className="text-gray-400 hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Horario de atención</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <FiClock className="mt-1 mr-2 flex-shrink-0" />
                  Lunes a viernes: 7:00 AM - 12:00 PM / 1:00 PM - 5:00 PM
                </li>
                <li className="flex items-start">
                  <FiClock className="mt-1 mr-2 flex-shrink-0" />
                  Sábados: 8:00 AM - 12:00 PM
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Centro de Formación SENA Garzón. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;