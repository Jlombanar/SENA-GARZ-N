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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 shadow backdrop-blur" : "bg-white/100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
              alt="SENA"
              className="h-10"
            />
            <span className="text-2xl font-bold text-green-700">
              SENA Garzón
            </span>
          </Link>
          <nav className="flex space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-green-700 hover:underline font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
              >
                Ir al Panel
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Formación Complementaria para el Futuro
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Plataforma educativa del <strong>SENA Garzón</strong> para
          instructores y aprendices.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {!user ? (
            <Link
              to="/register"
              className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition"
            >
              Empezar ahora
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition"
            >
              Ir al Panel
            </Link>
          )}
          <a
            href="#features"
            className="border border-green-700 text-green-700 px-6 py-3 rounded-full hover:bg-green-100 transition"
          >
            Ver funcionalidades
          </a>
        </div>
      </main>

      {/* Funciones */}
      <section
        id="features"
        className="py-20 px-4 max-w-7xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          ¿Qué puedes hacer en SENA Garzón?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Crear cursos",
              desc: "Los instructores pueden publicar cursos complementarios con horarios, recursos y fechas.",
              icon: "📝",
            },
            {
              title: "Inscripción fácil",
              desc: "Los aprendices pueden inscribirse con un clic y ver sus cursos activos.",
              icon: "✅",
            },
            {
              title: "Subida de material",
              desc: "Archivos, horarios, certificados y más disponibles desde el panel de instructor.",
              icon: "📎",
            },
            {
              title: "Estadísticas",
              desc: "Consulta cuántos estudiantes inscritos hay en cada curso.",
              icon: "📊",
            },
            {
              title: "Certificados",
              desc: "Genera certificados automáticos para los aprendices que finalizan.",
              icon: "🎓",
            },
            {
              title: "Accesibilidad",
              desc: "Compatible con dispositivos móviles, accesible y fácil de usar.",
              icon: "📱",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Galería (opcional) */}
      <div className="bg-gray-50 py-16">
        <ProductGallery />
      </div>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2 font-medium">SENA Garzón – Plataforma de formación complementaria</p>
          <p className="text-sm">© {new Date().getFullYear()} Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
