// src/pages/Welcome.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaCheckCircle,
  FaBook,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
  FaClock,
  FaStar,
  FaBars,
  FaTimes,
  FaBookmark,
  FaGraduationCap
} from "react-icons/fa";

const Welcome = () => {
  const [user, setUser] = useState({});
  const [likes, setLikes] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderTimer = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inscOpen, setInscOpen] = useState(false);
  const [inscCourseId, setInscCourseId] = useState(null);
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : { nombre: 'Aprendiz', rol: 'aprendiz' };
      setUser(parsed);
    } catch (_) {
      setUser({ nombre: 'Aprendiz', rol: 'aprendiz' });
    }
    const initialCounts = Object.fromEntries(cursosEjemplo.map(c => [c.id, c.likes || Math.floor(Math.random()*50)+5]));
    setLikesCount(initialCounts);
  }, []);

  const navigate = useNavigate();
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

  const submitInscripcion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      // Validar que es un curso real (ObjectId)
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(inscCourseId || ''));
      if (!isObjectId) { toast.info("Este es un curso de ejemplo. La inscripción solo está habilitada para cursos reales."); return; }
      const required = ["nombreCompleto","correo","telefono","documentoIdentidad","numeroTarjeta","file"];
      for (const k of required) { if (!ins[k]) { toast.error(`Falta ${k}`); return; } }
      setInsLoading(true);
      const fd = new FormData();
      fd.append('nombreCompleto', ins.nombreCompleto);
      fd.append('correo', ins.correo);
      fd.append('telefono', ins.telefono);
      fd.append('documentoIdentidad', ins.documentoIdentidad);
      if (ins.fechaNacimiento) {
        let fn = ins.fechaNacimiento;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fn)) {
          const [d, m, y] = fn.split('/');
          fn = `${y}-${m}-${d}`; // convertir a YYYY-MM-DD
        }
        fd.append('fechaNacimiento', fn);
      }
      if (ins.direccion) fd.append('direccion', ins.direccion);
      if (ins.ciudad) fd.append('ciudad', ins.ciudad);
      fd.append('numeroTarjeta', ins.numeroTarjeta);
      // El backend espera 'tarjetaPDF'
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

  const cursosEjemplo = [
    {
      id: 1,
      titulo: "Programación Avanzada",
      descripcion: "Domina algoritmos, estructuras de datos y patrones de diseño.",
      imagen: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
      categoria: "Tecnología",
      duracion: "8 semanas",
      nivel: "Avanzado",
      estudiantes: 245,
      rating: 4.8
    },
    {
      id: 2,
      titulo: "Diseño UX/UI Profesional",
      descripcion: "Aprende a crear interfaces centradas en el usuario con Figma y Adobe XD.",
      imagen: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=1200&auto=format&fit=crop",
      categoria: "Diseño",
      duracion: "6 semanas",
      nivel: "Intermedio",
      estudiantes: 189,
      rating: 4.7
    },
    {
      id: 3,
      titulo: "Mecánica Automotriz Moderna",
      descripcion: "Tecnologías híbridas y eléctricas en la industria automotriz.",
      imagen: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      categoria: "Automotriz",
      duracion: "10 semanas",
      nivel: "Principiante",
      estudiantes: 132,
      rating: 4.5
    },
    {
      id: 4,
      titulo: "Marketing Digital 360°",
      descripcion: "Estrategias integrales para redes sociales, SEO y publicidad digital.",
      imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      categoria: "Negocios",
      duracion: "12 semanas",
      nivel: "Intermedio",
      estudiantes: 210,
      rating: 4.6
    },
    {
      id: 5,
      titulo: "Inteligencia Artificial Básica",
      descripcion: "Introducción a los conceptos fundamentales de IA y machine learning.",
      imagen: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop",
      categoria: "Tecnología",
      duracion: "9 semanas",
      nivel: "Principiante",
      estudiantes: 312,
      rating: 4.9
    },
    {
      id: 6,
      titulo: "Fotografía Digital Creativa",
      descripcion: "Domina la técnica y el arte de la fotografía con cualquier dispositivo.",
      imagen: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
      categoria: "Arte",
      duracion: "7 semanas",
      nivel: "Intermedio",
      estudiantes: 176,
      rating: 4.7
    }
  ];

  const [cursosDB, setCursosDB] = useState([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/cursos");
        const mapeados = data.map(c => ({
          id: c._id,
          titulo: c.nombre,
          descripcion: c.descripcion || "",
          imagen: c.imagen || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
          categoria: c.categoria || "General",
          duracion: c.duracion || "120 horas",
          nivel: c.nivel || "Intermedio",
          estudiantes: (c.inscritos?.length) || 0,
          rating: 4.7,
          likesArr: c.likes || []
        }));
        setCursosDB(mapeados);
      } catch (_) {
        setCursosDB([]);
      } finally {
        setCargandoCursos(false);
      }
    };
    cargarCursos();
  }, []);

  const cursosFuente = cursosDB.length ? cursosDB : cursosEjemplo;
  const categorias = ["Todos", ...Array.from(new Set(cursosFuente.map(c => c.categoria))).filter(Boolean)];

  const featuredCursos = cursosFuente.slice(0, 4);

  const filteredCursos = cursosFuente.filter(curso =>
    (curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeCategory === "Todos" || curso.categoria === activeCategory)
  );

  const startAutoplay = () => {
    if (sliderTimer.current) return;
    sliderTimer.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCursos.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (sliderTimer.current) {
      clearInterval(sliderTimer.current);
      sliderTimer.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredCursos.length]);

  const renderCard = (curso, isFeatured = false) => (
    <div
      key={curso.id}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: isFeatured ? "12px" : "16px",
        overflow: "hidden",
        boxShadow: isFeatured ? "0 10px 30px rgba(0, 0, 0, 0.08)" : "0 8px 24px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        border: "none",
        position: "relative",
        transform: "translateY(0)",
        display: "flex",
        flexDirection: isFeatured ? "row" : "column",
        height: isFeatured ? "320px" : "auto",
        background: isFeatured ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" : "#ffffff"
      }}
      className="card-hover"
    >
      <div style={{ 
        position: "relative", 
        flex: isFeatured ? "1" : "none",
        minHeight: isFeatured ? "100%" : "200px",
        overflow: "hidden"
      }}>
        <img
          src={curso.imagen}
          alt={curso.titulo}
          style={{
            width: "100%",
            height: isFeatured ? "100%" : "200px",
            objectFit: "cover",
            transition: "transform 0.5s ease"
          }}
          className="card-image"
        />
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          backdropFilter: "blur(4px)",
          zIndex: 2
        }}>
          {curso.categoria}
        </div>
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          backdropFilter: "blur(4px)",
          zIndex: 2
        }}>
          {curso.nivel}
        </div>
        {isFeatured && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
            zIndex: 1
          }}></div>
        )}
      </div>
      <div style={{ 
        padding: isFeatured ? "32px" : "20px", 
        flex: isFeatured ? "1" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 2
      }}>
        <div>
          <h3 style={{
            color: isFeatured ? "#ffffff" : "#111827",
            fontSize: isFeatured ? "28px" : "18px",
            fontWeight: "700",
            marginBottom: "12px",
            lineHeight: "1.3",
            textShadow: isFeatured ? "0 2px 4px rgba(0,0,0,0.3)" : "none"
          }}>
            {curso.titulo}
          </h3>
          <p style={{
            color: isFeatured ? "rgba(255,255,255,0.9)" : "#6b7280",
            fontSize: isFeatured ? "16px" : "14px",
            marginBottom: "20px",
            lineHeight: "1.5"
          }}>
            {curso.descripcion}
          </p>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: isFeatured ? "rgba(255,255,255,0.9)" : "#6b7280",
            fontSize: "14px"
          }}>
            <FaClock />
            <span>{curso.duracion}</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: isFeatured ? "rgba(255,255,255,0.9)" : "#6b7280",
            fontSize: "14px"
          }}>
            <FaGraduationCap />
            <span>{curso.estudiantes} estudiantes</span>
          </div>
          <div style={{
            display: "flex",
            gap: "2px"
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} style={{ 
                color: star <= Math.round(curso.rating) ? "#fbbf24" : (isFeatured ? "rgba(255,255,255,0.4)" : "#d1d5db"), 
                fontSize: "14px" 
              }} />
            ))}
          </div>
        </div>
        
        <div style={{
          display: "flex",
          gap: "12px"
        }}>
          <button
            onClick={() => handleLike(curso.id)}
            style={{
              background: likes[curso.id] ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "rgba(255,255,255,0.9)",
              color: likes[curso.id] ? "white" : "#374151",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              backdropFilter: isFeatured ? "blur(4px)" : "none"
            }}
          >
            <FaBookmark style={{ fontSize: "14px" }} />
            {likes[curso.id] ? "Guardado" : "Guardar"} {likesCount[curso.id] || 0}
          </button>
          <button onClick={() => handleInscribirse(curso.id)} style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 6px rgba(16, 185, 129, 0.3)"
          }}>
            <FaCheckCircle style={{ fontSize: "14px" }} />
            Inscribirse
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", 
      color: "#111827", 
      fontFamily: "'Inter', system-ui, sans-serif",
      lineHeight: "1.5"
    }}>
      {/* Header */}
      <header style={{ 
        background: "rgba(255, 255, 255, 0.95)", 
        padding: "16px 0", 
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{ 
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
              width: 40, 
              height: 40, 
              borderRadius: 10, 
              display: "grid", 
              placeItems: "center", 
              fontSize: 20, 
              fontWeight: 900, 
              color: "#fff",
              boxShadow: "0 4px 6px rgba(16, 185, 129, 0.3)"
            }}>
              <FaBookOpen />
            </div>
            <h1 style={{
              fontSize: 20,
              fontWeight: 800,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.5px"
            }}>
              SENA Garzón
            </h1>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: "#64748b",
                fontSize: "24px",
                cursor: "pointer"
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px"
      }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: 60,
          padding: "60px 0",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
            zIndex: 0
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
            zIndex: 0
          }}></div>
          
          <div style={{ 
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
            display: "inline-flex", 
            padding: "20px", 
            borderRadius: "20px", 
            marginBottom: "24px",
            boxShadow: "0 10px 15px rgba(16, 185, 129, 0.3)",
            position: "relative",
            zIndex: 1
          }}>
            <FaBook style={{ fontSize: 40, color: "#ffffff" }} />
          </div>
          <h2 style={{ 
            fontSize: "3rem", 
            fontWeight: 800, 
            marginBottom: 12, 
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.5px",
            position: "relative",
            zIndex: 1
          }}>
            Bienvenido, <span style={{ color: "#059669" }}>{user.nombre}</span>
          </h2>
          <p style={{ 
            fontSize: 18, 
            color: "#64748b", 
            maxWidth: 720, 
            margin: "0 auto", 
            lineHeight: 1.6,
            position: "relative",
            zIndex: 1
          }}>
            Explora nuestra amplia oferta de cursos y continúa tu camino de aprendizaje con SENA Garzón.
          </p>
          
          {/* Barra de búsqueda movida aquí */}
          <div style={{
            marginTop: "32px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}>
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  background: "#ffffff", 
                  border: "2px solid #e2e8f0", 
                  padding: "16px 20px 16px 50px", 
                  borderRadius: "16px", 
                  color: "#111827", 
                  width: "400px", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              />
              <FaSearch style={{ 
                position: "absolute", 
                left: "20px", 
                color: "#10b981", 
                fontSize: "18px" 
              }} />
            </div>
          </div>
        </div>

        {/* Filtros de categoría */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "32px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 
                  "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#ffffff",
                color: activeCategory === cat ? "#ffffff" : "#64748b",
                border: "1px solid #e2e8f0",
                padding: "10px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 6px rgba(0,0,0,0.03)"
              }}
              className="category-btn"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carrusel de cursos destacados */}
        <section style={{ marginBottom: "60px" }} onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
          <div style={{ 
            position: "relative", 
            borderRadius: "16px", 
            overflow: "hidden",
            boxShadow: "0 20px 25px rgba(0,0,0,0.05)"
          }}>
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0"
            }}>
              {featuredCursos.map((curso, index) => (
                <div key={curso.id} style={{
                  display: index === currentSlide ? "block" : "none",
                  transition: "opacity 0.5s ease"
                }}>
                  {renderCard(curso, true)}
                </div>
              ))}
            </div>

            {/* Controles del carrusel */}
            <button 
              aria-label="Anterior" 
              onClick={() => setCurrentSlide((currentSlide - 1 + featuredCursos.length) % featuredCursos.length)}
              style={{ 
                position: "absolute", 
                left: 20, 
                top: "50%", 
                transform: "translateY(-50%)", 
                background: "rgba(255, 255, 255, 0.9)", 
                color: "#059669", 
                border: "none", 
                borderRadius: "50%", 
                width: 50, 
                height: 50, 
                display: "grid", 
                placeItems: "center", 
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontWeight: "bold",
                fontSize: "18px",
                transition: "all 0.2s ease",
                zIndex: 3
              }}
              className="carousel-btn"
            >
              <FaChevronLeft />
            </button>
            <button 
              aria-label="Siguiente" 
              onClick={() => setCurrentSlide((currentSlide + 1) % featuredCursos.length)}
              style={{ 
                position: "absolute", 
                right: 20, 
                top: "50%", 
                transform: "translateY(-50%)", 
                background: "rgba(255, 255, 255, 0.9)", 
                color: "#059669", 
                border: "none", 
                borderRadius: "50%", 
                width: 50, 
                height: 50, 
                display: "grid", 
                placeItems: "center", 
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontWeight: "bold",
                fontSize: "18px",
                transition: "all 0.2s ease",
                zIndex: 3
              }}
              className="carousel-btn"
            >
              <FaChevronRight />
            </button>

            {/* Indicadores */}
            <div style={{ 
              position: "absolute", 
              bottom: 20, 
              left: 0, 
              right: 0, 
              display: "flex", 
              justifyContent: "center", 
              gap: 8,
              zIndex: 3
            }}>
              {featuredCursos.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)} 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: "50%", 
                    cursor: "pointer", 
                    background: i === currentSlide ? "#059669" : "rgba(255,255,255,0.7)",
                    border: "none",
                    transition: "all 0.2s ease"
                  }} 
                  aria-label={`Ir al slide ${i+1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Cursos Section */}
        <section>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            justifyContent: "center"
          }}>
            <div style={{
              width: "4px",
              height: "32px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "2px"
            }}></div>
            <h3 style={{
              fontSize: "28px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}>
              Cursos disponibles
            </h3>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
            gap: 24 
          }}>
            {filteredCursos.map(curso => renderCard(curso))}
          </div>

          {filteredCursos.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b"
            }}>
              <FaSearch style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }} />
              <h4 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                No se encontraron cursos
              </h4>
              <p>Intenta con otros términos de búsqueda o selecciona otra categoría</p>
            </div>
          )}
        </section>
      </main>

      {/* Modal Inscripción */}
      {inscOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#ffffff", width: "min(700px, 94%)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Inscribirse al curso</h3>
              <button onClick={() => setInscOpen(false)} style={{ background: "transparent", border: 0, fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input placeholder="Nombre completo *" value={ins.nombreCompleto} onChange={e=>setIns({ ...ins, nombreCompleto: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Correo *" type="email" value={ins.correo} onChange={e=>setIns({ ...ins, correo: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Teléfono *" value={ins.telefono} onChange={e=>setIns({ ...ins, telefono: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Documento *" value={ins.documentoIdentidad} onChange={e=>setIns({ ...ins, documentoIdentidad: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Fecha nacimiento" type="date" value={ins.fechaNacimiento} onChange={e=>setIns({ ...ins, fechaNacimiento: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Ciudad" value={ins.ciudad} onChange={e=>setIns({ ...ins, ciudad: e.target.value })} className="border p-2 rounded" />
                <input placeholder="Dirección" value={ins.direccion} onChange={e=>setIns({ ...ins, direccion: e.target.value })} className="border p-2 rounded col-span-2" />
                <input placeholder="Número de tarjeta *" value={ins.numeroTarjeta} onChange={e=>setIns({ ...ins, numeroTarjeta: e.target.value })} className="border p-2 rounded col-span-2" />
                <input type="file" accept="application/pdf" onChange={e=>setIns({ ...ins, file: e.target.files?.[0] || null })} className="border p-2 rounded col-span-2" />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                <button onClick={()=>setInscOpen(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button onClick={submitInscripcion} disabled={insLoading} className="px-4 py-2 rounded text-white" style={{ background: insLoading ? "#9ca3af" : "#16a34a" }}>{insLoading ? "Enviando..." : "Enviar solicitud"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 15px rgba(16, 185, 129, 0.3)",
          zIndex: "1000",
          animation: "slideIn 0.3s ease",
          display: "flex",
          alignItems: "center",
          fontWeight: "600",
          backdropFilter: "blur(4px)"
        }}>
          <FaBookmark style={{ marginRight: "10px" }} />
          Curso guardado en favoritos
        </div>
      )}

      <style jsx>{`
        .card-hover:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        }
        
        .card-hover:hover .card-image {
          transform: scale(1.05);
        }
        
        .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.08) !important;
        }
        
        .carousel-btn:hover {
          background: rgba(255, 255, 255, 1) !important;
          transform: translateY(-50%) scale(1.1);
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
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
