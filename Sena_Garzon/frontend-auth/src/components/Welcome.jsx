import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaSearch,
  FaBookOpen,
  FaClock,
  FaStar,
  FaBars,
  FaTimes,
  FaBookmark,
  FaGraduationCap,
  FaArrowRight,
  FaArrowUp,
  FaEye,
  FaPlayCircle,
  FaFileAlt,
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLaptopCode,
  FaCogs,
  FaChartLine,
  FaLeaf,
  FaHeart,
  FaInfoCircle
} from "react-icons/fa";

// Componente Carrusel
const Carousel = ({ onSearchChange, searchTerm, onKnowMoreClick }) => {
  // Imágenes específicas de cursos complementarios del SENA
  const images = [
    { 
      src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
      alt: "Programación y Desarrollo Web", 
      title: "Domina la", 
      subtitle: "Programación Web", 
      description: "Aprende HTML, CSS, JavaScript y frameworks modernos. Conviértete en desarrollador full-stack con nuestros cursos complementarios." 
    },
    { 
      src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
      alt: "Gestión Empresarial", 
      title: "Impulsa tu", 
      subtitle: "Gestión Empresarial", 
      description: "Desarrolla habilidades en administración, liderazgo y gestión de proyectos para destacar en el mundo empresarial." 
    },
    { 
      src: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
      alt: "Marketing Digital", 
      title: "Conquista el", 
      subtitle: "Marketing Digital", 
      description: "Estrategias de redes sociales, SEO, publicidad online y analítica web para potenciar tu presencia digital." 
    },
    { 
      src: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
      alt: "Servicios de Salud", 
      title: "Especialízate en", 
      subtitle: "Servicios de Salud", 
      description: "Primeros auxilios, cuidado de pacientes y técnicas de atención en salud para una carrera con propósito." 
    },
    { 
      src: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
      alt: "Agricultura Sostenible", 
      title: "Innova en", 
      subtitle: "Agricultura Sostenible", 
      description: "Técnicas modernas de cultivo, agricultura orgánica y gestión sostenible de recursos naturales." 
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleVerCursosClick = () => {
    document.getElementById('cursos-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', marginBottom: '60px', height: '600px' }}>
      <div style={{ display: 'flex', transition: 'transform 0.8s ease-in-out', transform: `translateX(-${currentIndex * 100}%)`, height: '100%' }}>
        {images.map((image, index) => (
          <div key={index} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
            <img 
              src={image.src} 
              alt={image.alt} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0, 0, 0, 0.65)', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '0 40px',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "15px", lineHeight: "1.1", textShadow: "0 4px 10px rgba(0,0,0,0.6)", color: "white" }}>
                {image.title} <br />
                <span style={{ background: "linear-gradient(135deg, #A8E063 0%, #56AB2F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {image.subtitle}
                </span>
              </h2>
              <p style={{ fontSize: "1.2rem", marginBottom: "32px", lineHeight: "1.6", opacity: "0.95", maxWidth: "600px", margin: "0 auto 32px auto", color: "white", textShadow: "0 2px 5px rgba(0,0,0,0.4)" }}>
                {image.description}
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", zIndex: 3 }}>
                <button onClick={handleVerCursosClick} style={{ background: "linear-gradient(135deg, #A8E063 0%, #56AB2F 100%)", color: "#FFFFFF", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease", boxShadow: "0 8px 16px rgba(86, 171, 47, 0.3)" }} className="hero-btn">
                  Ver Cursos Disponibles <FaArrowRight />
                </button>
                <button onClick={onKnowMoreClick} style={{ background: "rgba(255, 255, 255, 0.15)", color: "white", border: "2px solid rgba(255, 255, 255, 0.3)", padding: "16px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease", backdropFilter: "blur(4px)" }} className="hero-btn-secondary">
                  <FaInfoCircle />
                  Conocer Más
                </button>
              </div>
              <div style={{ marginTop: "40px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: '100%', maxWidth: '400px', zIndex: 3 }}>
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  style={{ background: "rgba(255, 255, 255, 0.95)", border: "2px solid rgba(255, 255, 255, 0.2)", padding: "16px 20px 16px 50px", borderRadius: "16px", color: "#1A202C", width: "100%", fontSize: "16px", outline: "none", transition: "all 0.2s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", backdropFilter: "blur(4px)" }}
                />
                <FaSearch style={{ position: "absolute", left: "20px", color: "#64748b", fontSize: "18px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={prevSlide}
        style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '24px', color: 'white', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 5 }}
      >
        &#10094;
      </button>
      <button 
        onClick={nextSlide}
        style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '24px', color: 'white', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 5 }}
      >
        &#10095;
      </button>
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 5 }}>
        {images.map((_, index) => (
          <div 
            key={index}
            style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)', transition: 'background-color 0.3s' }}
          />
        ))}
      </div>
    </div>
  );
};

// Componente de Información del SENA
const AboutSena = ({ onClose }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 300, overflowY: 'auto', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', maxWidth: '900px', width: '100%', position: 'relative', marginTop: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#6b7280', zIndex: 5 }}>
          <FaTimes />
        </button>
        
        {/* Header con imagen */}
        <div style={{ position: 'relative', height: '300px', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="SENA Garzón" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(46, 125, 50, 0.9) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: 'white', marginBottom: '16px', textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
              SENA Garzón
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'white', opacity: '0.95', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Centro de Formación para el Desarrollo del Huila
            </p>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Misión y Visión */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1A202C', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaTrophy style={{ color: '#4CAF50' }} />
              Nuestra Misión
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: '1.7', marginBottom: '24px' }}>
              El SENA Garzón está comprometido con la formación profesional integral que contribuye al desarrollo competitivo 
              del país a través del mejoramiento de la productividad empresarial y el desarrollo social y tecnológico de los trabajadores.
            </p>
            
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1A202C', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaEye style={{ color: '#4CAF50' }} />
              Nuestra Visión
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: '1.7', marginBottom: '32px' }}>
              Ser reconocida como la institución líder en formación profesional integral y desarrollo tecnológico 
              del sur del Huila, formando talento humano competente y competitivo.
            </p>
          </div>

          {/* Áreas de formación */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1A202C', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaGraduationCap style={{ color: '#4CAF50' }} />
              Áreas de Formación
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#F0FDF4', padding: '24px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                <FaLaptopCode style={{ fontSize: '2rem', color: '#4CAF50', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#065F46', marginBottom: '8px' }}>Tecnologías de la Información</h4>
                <p style={{ color: '#047857', fontSize: '0.95rem' }}>Programación, desarrollo web, bases de datos y sistemas de información.</p>
              </div>
              <div style={{ background: '#F0F9FF', padding: '24px', borderRadius: '16px', border: '1px solid #BAE6FD' }}>
                <FaCogs style={{ fontSize: '2rem', color: '#0284C7', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0C4A6E', marginBottom: '8px' }}>Gestión Empresarial</h4>
                <p style={{ color: '#0369A1', fontSize: '0.95rem' }}>Administración, liderazgo, gestión de proyectos y emprendimiento.</p>
              </div>
              <div style={{ background: '#FEF7FF', padding: '24px', borderRadius: '16px', border: '1px solid #E9D5FF' }}>
                <FaChartLine style={{ fontSize: '2rem', color: '#9333EA', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#581C87', marginBottom: '8px' }}>Marketing Digital</h4>
                <p style={{ color: '#7C3AED', fontSize: '0.95rem' }}>Redes sociales, SEO, publicidad online y analítica web.</p>
              </div>
              <div style={{ background: '#FFF7ED', padding: '24px', borderRadius: '16px', border: '1px solid #FED7AA' }}>
                <FaLeaf style={{ fontSize: '2rem', color: '#EA580C', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#9A3412', marginBottom: '8px' }}>Agricultura Sostenible</h4>
                <p style={{ color: '#C2410C', fontSize: '0.95rem' }}>Técnicas modernas, agricultura orgánica y gestión sostenible.</p>
              </div>
              <div style={{ background: '#FDF2F8', padding: '24px', borderRadius: '16px', border: '1px solid #FBBF24' }}>
                <FaHeart style={{ fontSize: '2rem', color: '#EC4899', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#9D174D', marginBottom: '8px' }}>Servicios de Salud</h4>
                <p style={{ color: '#BE185D', fontSize: '0.95rem' }}>Primeros auxilios, cuidado de pacientes y atención en salud.</p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1A202C', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaChartLine style={{ color: '#4CAF50' }} />
              Nuestro Impacto
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', padding: '24px', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>2,500+</div>
                <div style={{ fontSize: '1rem', opacity: '0.9' }}>Estudiantes Formados</div>
              </div>
              <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)', color: 'white', padding: '24px', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>15+</div>
                <div style={{ fontSize: '1rem', opacity: '0.9' }}>Años de Experiencia</div>
              </div>
              <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white', padding: '24px', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>50+</div>
                <div style={{ fontSize: '1rem', opacity: '0.9' }}>Cursos Disponibles</div>
              </div>
              <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)', color: 'white', padding: '24px', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>95%</div>
                <div style={{ fontSize: '1rem', opacity: '0.9' }}>Empleabilidad</div>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div style={{ background: '#F8FAFC', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1A202C', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaMapMarkerAlt style={{ color: '#4CAF50' }} />
              Información de Contacto
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '8px' }}><strong>Dirección:</strong></p>
                <p style={{ color: '#6b7280' }}>Carrera 11 No. 1-50, Garzón, Huila</p>
              </div>
              <div>
                <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '8px' }}><strong>Teléfono:</strong></p>
                <p style={{ color: '#6b7280' }}>(8) 838-7676</p>
              </div>
              <div>
                <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '8px' }}><strong>Email:</strong></p>
                <p style={{ color: '#6b7280' }}>info@sena.edu.co</p>
              </div>
              <div>
                <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '8px' }}><strong>Horario:</strong></p>
                <p style={{ color: '#6b7280' }}>Lunes a Viernes: 7:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button 
              onClick={scrollToTop} 
              style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FaArrowUp />
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Welcome Principal
const Welcome = () => {
  const [user, setUser] = useState({});
  const [likes, setLikes] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inscOpen, setInscOpen] = useState(false);
  const [inscCourseId, setInscCourseId] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAboutSena, setShowAboutSena] = useState(false);
  
  // Estados para el modal de detalles
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [ins, setIns] = useState({
    nombreCompleto: "",
    correo: "",
    telefono: "",
    documentoIdentidad: "",
    fechaNacimiento: "",
    direccion: "",
    ciudad: "",
    numeroTarjeta: "",
    file: null
  });
  const [insLoading, setInsLoading] = useState(false);
  const [cursosDB, setCursosDB] = useState([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : { nombre: 'Aprendiz', rol: 'aprendiz' };
      setUser(parsed);
    } catch (_) {
      setUser({ nombre: 'Aprendiz', rol: 'aprendiz' });
    }
    const initialCounts = {};
    setLikesCount(initialCounts);
    // Si llega query ?inscribir=ID abrir el formulario de ese curso
    const params = new URLSearchParams(window.location.search);
    const insId = params.get('inscribir');
    if (insId) {
      setInscCourseId(insId);
      setInscOpen(true);
    }
  }, []);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/cursos");
        const mapeados = data.map(c => ({
          id: c._id,
          titulo: c.nombre || 'Curso sin título',
          descripcion: c.descripcion || 'Descripción no disponible',
          informacionAdicional: c.informacionAdicional || '',
          imagen: c.imagen || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
          categoria: c.categoria || "General",
          duracion: c.duracion || "Por definir",
          cantidad: typeof c.cantidad === 'number' ? c.cantidad : Number(c.cantidad) || 0,
          nivel: c.nivel || "Por definir",
          estudiantes: (c.inscritos?.length) || 0,
          rating: c.rating || 4.7,
          likesArr: c.likes || [],
          
          // Datos específicos para el modal de detalles
          fechaInicio: c.fechaInicio || null,
          fechaFin: c.fechaFin || null,
          modalidad: c.modalidad || "Por definir",
          precio: c.precio || "Consultar",
          instructor: c.instructor || "Instructor SENA",
          capacidadMaxima: c.capacidadMaxima || null,
          horario: c.horario || null,
          ubicacion: c.ubicacion || null,
          
          // Arrays de información detallada
          objetivos: c.objetivos && Array.isArray(c.objetivos) && c.objetivos.length > 0 
            ? c.objetivos 
            : null,
          contenido: c.contenido && Array.isArray(c.contenido) && c.contenido.length > 0 
            ? c.contenido 
            : null,
          requisitos: c.requisitos && Array.isArray(c.requisitos) && c.requisitos.length > 0 
            ? c.requisitos 
            : null,
          
          // Datos adicionales
          estado: c.estado || 'activo',
          certificacion: c.certificacion || null,
          metodologia: c.metodologia || null
        }));
        setCursosDB(mapeados);
      } catch (error) {
        console.error('Error cargando cursos:', error);
        setCursosDB([]);
        toast.error('Error al cargar los cursos');
      } finally {
        setCargandoCursos(false);
      }
    };
    cargarCursos();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
      setLikesCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + (likes[id] ? -1 : 1) }));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1500);
      const idStr = String(id);
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(idStr);
      if (isObjectId) {
        await axios.post(`http://localhost:5000/api/cursos/${idStr}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (e) {
      setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
      setLikesCount((prev) => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 0) }));
    }
  };

  const handleInscribirse = (id) => {
    setInscCourseId(String(id));
    setInscOpen(true);
  };

  const handleVerDetalles = (curso) => {
    setSelectedCourse(curso);
    setDetailsOpen(true);
  };

  const handleKnowMoreClick = () => {
    setShowAboutSena(true);
  };

  const submitInscripcion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(inscCourseId || ''));
      if (!isObjectId) { 
        toast.info("Este es un curso de ejemplo. La inscripción solo está habilitada para cursos reales."); 
        return; 
      }
      const required = ["nombreCompleto","correo","telefono","documentoIdentidad","numeroTarjeta","file"];
      for (const k of required) { 
        if (!ins[k]) { 
          toast.error(`El campo ${k} es obligatorio.`); 
          return; 
        } 
      }
      
      setInsLoading(true);
      const fd = new FormData();
      fd.append('nombreCompleto', ins.nombreCompleto);
      fd.append('correo', ins.correo);
      fd.append('telefono', ins.telefono);
      fd.append('documentoIdentidad', ins.documentoIdentidad);
      if (ins.fechaNacimiento) fd.append('fechaNacimiento', ins.fechaNacimiento);
      if (ins.direccion) fd.append('direccion', ins.direccion);
      if (ins.ciudad) fd.append('ciudad', ins.ciudad);
      fd.append('numeroTarjeta', ins.numeroTarjeta);
      fd.append('tarjetaPDF', ins.file);
      
      await axios.post(`http://localhost:5000/api/cursos/${inscCourseId}/inscribirse`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Solicitud enviada correctamente");
      setInscOpen(false);
      setIns({ nombreCompleto:"", correo:"", telefono:"", documentoIdentidad:"", fechaNacimiento:"", direccion:"", ciudad:"", numeroTarjeta:"", file:null });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error al inscribirse");
    } finally {
      setInsLoading(false);
    }
  };

  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Por definir';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const categorias = ["Todos", ...Array.from(new Set(cursosDB.map(c => c.categoria))).filter(Boolean)];

  const filteredCursos = cursosDB.filter(curso =>
    (curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeCategory === "Todos" || curso.categoria === activeCategory) &&
    curso.estado === 'activo' // Solo mostrar cursos activos
  );

  const cursosToShow = showAllCourses ? filteredCursos : filteredCursos.slice(0, 6);

  const renderCard = (curso) => (
    <div
      key={curso.id}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      className="card-hover"
    >
      <div style={{ position: "relative", minHeight: "200px", overflow: "hidden" }}>
        <img
          src={curso.imagen}
          alt={curso.titulo}
          style={{ width: "100%", height: "200px", objectFit: "cover", transition: "transform 0.5s ease" }}
          className="card-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop";
          }}
        />
        <div style={{ position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", zIndex: 2 }}>
          {curso.categoria}
        </div>
        <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0, 0, 0, 0.7)", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", zIndex: 2 }}>
          {curso.nivel}
        </div>
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
        <div>
          <h3 style={{ color: "#111827", fontSize: "18px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.3" }}>
            {curso.titulo}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {curso.descripcion}
          </p>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
              <FaClock />
              <span>{curso.duracion}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", fontSize: "14px" }}>
              <FaGraduationCap />
              <span>{curso.estudiantes} estudiantes</span>
            </div>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} style={{ color: star <= Math.round(curso.rating) ? "#FFC107" : "#d1d5db", fontSize: "14px" }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleLike(curso.id)}
              style={{ background: likes[curso.id] ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "#F0F0F0", color: likes[curso.id] ? "white" : "#374151", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease", fontWeight: "600", fontSize: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
            >
              <FaBookmark style={{ fontSize: "12px" }} />
              {likesCount[curso.id] || curso.likesArr?.length || 0}
            </button>
            <button 
              onClick={() => handleVerDetalles(curso)} 
              style={{ background: "#3B82F6", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "12px", transition: "all 0.2s ease", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)" }}
            >
              <FaEye style={{ fontSize: "12px" }} />
              Ver más
            </button>
            <button 
              onClick={() => handleInscribirse(curso.id)} 
              style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "12px", transition: "all 0.2s ease", boxShadow: "0 4px 6px rgba(76, 175, 80, 0.3)" }}
            >
              <FaCheckCircle style={{ fontSize: "12px" }} />
              Inscribirse
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F9FAFB 0%, #EDF2F7 100%)", color: "#1A202C", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.5" }}>
      {/* Header */}
      <header style={{ background: "rgba(255, 255, 255, 0.95)", padding: "16px 0", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 20, fontWeight: 900, color: "#fff", boxShadow: "0 4px 6px rgba(76, 175, 80, 0.3)" }}>
              <FaBookOpen />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A202C", letterSpacing: "-0.5px", display: 'flex', alignItems: 'baseline' }}>
              Bienvenido a <span style={{ fontFamily: "inherit", fontSize: '1em', marginLeft: '8px', background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SENA Garzón</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: "none", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#64748b", fontSize: "24px", cursor: "pointer" }} className="mobile-menu-btn">
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Carrusel Section - Ahora con contenido del Hero */}
        <div style={{ marginBottom: "60px" }}>
          <Carousel 
            onSearchChange={(e) => setSearchTerm(e.target.value)} 
            searchTerm={searchTerm}
            onKnowMoreClick={handleKnowMoreClick}
          />
        </div>
        
        {/* Categories Section */}
        <section style={{ marginBottom: "60px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: `2px solid ${activeCategory === cat ? '#4CAF50' : '#d1d5db'}`,
                  background: activeCategory === cat ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' : '#F9FAFB',
                  color: activeCategory === cat ? 'white' : '#4b5563',
                  boxShadow: activeCategory === cat ? '0 4px 8px rgba(76, 175, 80, 0.2)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section id="cursos-section" style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "40px", textAlign: "center", color: "#1A202C" }}>
            Explora Nuestros Cursos
          </h2>
          {cargandoCursos ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Cargando cursos...</p>
            </div>
          ) : (
            <>
              {filteredCursos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                  <FaSearch size={48} style={{ marginBottom: "20px" }} />
                  <p>No se encontraron cursos que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px" }}>
                  {cursosToShow.map(renderCard)}
                </div>
              )}
            </>
          )}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            {!showAllCourses && filteredCursos.length > 6 && (
              <button 
                onClick={() => setShowAllCourses(true)} 
                style={{ background: "#16A34A", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.3s" }}
              >
                Ver más cursos
              </button>
            )}
            {showAllCourses && (
              <button 
                onClick={() => setShowAllCourses(false)} 
                style={{ background: "#16A34A", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.3s" }}
              >
                Mostrar menos cursos
              </button>
            )}
          </div>
        </section>
      </main>
      
      {/* Modal About SENA */}
      {showAboutSena && (
        <AboutSena onClose={() => setShowAboutSena(false)} />
      )}
      
      {/* Modal Inscripción */}
      {inscOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '600px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setInscOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}><FaTimes /></button>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>Formulario de Inscripción</h3>
            <form onSubmit={(e) => { e.preventDefault(); submitInscripcion(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input type="text" placeholder="Nombre Completo" value={ins.nombreCompleto} onChange={(e) => setIns({ ...ins, nombreCompleto: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="email" placeholder="Correo Electrónico" value={ins.correo} onChange={(e) => setIns({ ...ins, correo: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="tel" placeholder="Teléfono" value={ins.telefono} onChange={(e) => setIns({ ...ins, telefono: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="text" placeholder="Documento de Identidad" value={ins.documentoIdentidad} onChange={(e) => setIns({ ...ins, documentoIdentidad: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="date" placeholder="Fecha de Nacimiento" value={ins.fechaNacimiento} onChange={(e) => setIns({ ...ins, fechaNacimiento: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="text" placeholder="Dirección" value={ins.direccion} onChange={(e) => setIns({ ...ins, direccion: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="text" placeholder="Ciudad" value={ins.ciudad} onChange={(e) => setIns({ ...ins, ciudad: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <input type="text" placeholder="Número de Tarjeta de Identidad o Cédula" value={ins.numeroTarjeta} onChange={(e) => setIns({ ...ins, numeroTarjeta: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Adjuntar Tarjeta de Identidad o Cédula (PDF)</label>
                <input type="file" accept="application/pdf" onChange={(e) => setIns({ ...ins, file: e.target.files[0] })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' }} />
              </div>
              <button type="submit" disabled={insLoading} style={{ background: insLoading ? '#9ca3af' : 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                {insLoading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {detailsOpen && selectedCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, overflowY: 'auto' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '800px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative', margin: '20px' }}>
            <button onClick={() => setDetailsOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}><FaTimes /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedCourse.imagen && (
                <img src={selectedCourse.imagen} alt={selectedCourse.titulo} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }} />
              )}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>{selectedCourse.titulo}</h3>
                <p style={{ fontSize: '16px', color: '#6b7280', whiteSpace: 'pre-line' }}>
                  {selectedCourse.descripcion}
                </p>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px', color: '#065F46' }}>
                  <span style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 12px', borderRadius: '9999px', fontSize: '14px' }}>
                    Cupos: {selectedCourse.cantidad}
                  </span>
                </div>
                {selectedCourse.informacionAdicional && (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', color: '#065F46', textAlign: 'left' }}>
                    <strong>Más información:</strong>
                    <div style={{ marginTop: '8px', whiteSpace: 'pre-line' }}>{selectedCourse.informacionAdicional}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notificación */}
      {showNotification && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#10B981', color: 'white', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaCheckCircle />
          ¡Curso guardado en favoritos!
        </div>
      )}

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
        
        .card-image:hover {
          transform: scale(1.05);
        }
        
        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(86, 171, 47, 0.4);
        }
        
        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Welcome;