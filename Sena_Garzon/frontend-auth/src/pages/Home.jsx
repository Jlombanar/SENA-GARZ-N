import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGallery from "../components/ProductGallery";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header moderno */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-green-600 p-2 rounded-lg">
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
                  className="px-4 py-2 text-green-700 font-medium hover:text-green-600 transition-colors rounded-lg"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow hover:shadow-md"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow hover:shadow-md flex items-center"
              >
                Mi Panel
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero section con imagen de fondo */}
      <div className="relative pt-32 pb-20 px-6 bg-gradient-to-r from-green-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Formación <span className="text-green-600">Técnica</span> de Excelencia en el Huila
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Centro de formación profesional que transforma vidas a través de la educación.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <Link
                  to="/register"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow hover:shadow-md"
                >
                  Inscríbete Ahora
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow hover:shadow-md"
                >
                  Acceder al Panel
                </Link>
              )}
              <a
                href="#cursos"
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                Ver Cursos
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-green-300 rounded-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Estudiantes SENA"
                className="relative rounded-xl shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de características */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra <span className="text-green-600">Oferta</span> Educativa</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Formación complementaria que se adapta a las necesidades del sector productivo
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de imágenes */}
      <section id="cursos" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestros <span className="text-green-600">Programas</span></h2>
          <ProductGallery />
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Historias de <span className="text-green-100">Éxito</span></h2>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg mb-8">
            <p className="text-lg italic mb-4">
              "El SENA Garzón me dio las herramientas para montar mi propio negocio. Hoy tengo una panadería que da empleo a 3 personas más."
            </p>
            <p className="font-semibold">- María Fernanda, egresada de Panadería</p>
          </div>
          <Link
            to="/testimonios"
            className="inline-block px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Ver más testimonios
          </Link>
        </div>
      </section>

      {/* Footer completo */}
      <footer className="py-12 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                    alt="SENA"
                    className="h-8"
                  />
                </div>
                <span className="text-xl font-bold">SENA Garzón</span>
              </div>
              <p className="text-gray-400">
                Centro de formación profesional comprometido con el desarrollo del Huila a través de la educación técnica.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Inicio</Link></li>
                <li><Link to="/cursos" className="text-gray-400 hover:text-white transition">Cursos</Link></li>
                <li><Link to="/contacto" className="text-gray-400 hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Garzón, Huila
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (8) 123 4567
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Centro de Formación SENA Garzón. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">Formando a los profesionales que el Huila necesita</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;