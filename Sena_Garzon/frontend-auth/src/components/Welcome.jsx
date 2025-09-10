// src/pages/Welcome.js
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
  FaArrowUp
} from "react-icons/fa";

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
    // Idealmente, esto debería venir del backend
    setLikesCount(initialCounts);
  }, []);

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
          rating: 4.7, // Rating de ejemplo
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
      // Revertir el estado si la API falla
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
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(inscCourseId || ''));
      if (!isObjectId) { toast.info("Este es un curso de ejemplo. La inscripción solo está habilitada para cursos reales."); return; }
      const required = ["nombreCompleto","correo","telefono","documentoIdentidad","numeroTarjeta","file"];
      for (const k of required) { if (!ins[k]) { toast.error(`El campo ${k} es obligatorio.`); return; } }
      
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

  const categorias = ["Todos", ...Array.from(new Set(cursosDB.map(c => c.categoria))).filter(Boolean)];

  const filteredCursos = cursosDB.filter(curso =>
    (curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeCategory === "Todos" || curso.categoria === activeCategory)
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
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", lineHeight: "1.5" }}>
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
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => handleLike(curso.id)}
              style={{ background: likes[curso.id] ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "#F0F0F0", color: likes[curso.id] ? "white" : "#374151", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease", fontWeight: "600", fontSize: "14px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
            >
              <FaBookmark style={{ fontSize: "14px" }} />
              {likesCount[curso.id] || 0}
            </button>
            <button onClick={() => handleInscribirse(curso.id)} style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "14px", transition: "all 0.2s ease", boxShadow: "0 4px 6px rgba(76, 175, 80, 0.3)" }}>
              <FaCheckCircle style={{ fontSize: "14px" }} />
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
              Bienvenido a <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.2em', marginLeft: '8px', background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SENA Garzón</span>
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
        {/* Hero Section */}
        <div style={{ position: "relative", height: "500px", borderRadius: "24px", overflow: "hidden", marginBottom: "60px", backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.6)", zIndex: 1 }}></div>
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "white", maxWidth: "800px", padding: "0 20px" }}>
            <h2 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "20px", lineHeight: "1.1", textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}>
              Transforma tu Futuro con <br />
              <span style={{ background: "linear-gradient(135deg, #A8E063 0%, #56AB2F 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" /* Eliminar backdropFilter de aquí */ }}>
                Cursos Complementarios
              </span>
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "32px", lineHeight: "1.6", opacity: "0.95", maxWidth: "600px", margin: "0 auto 32px auto" }}>
              Desarrolla nuevas habilidades, potencia tu carrera profesional y alcanza tus metas con nuestros cursos especializados.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => document.getElementById('cursos-section').scrollIntoView({ behavior: 'smooth' })} style={{ background: "linear-gradient(135deg, #A8E063 0%, #56AB2F 100%)", color: "#FFFFFF", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease", boxShadow: "0 8px 16px rgba(86, 171, 47, 0.3)" }} className="hero-btn">
                Ver Cursos Disponibles <FaArrowRight />
              </button>
              <button style={{ background: "rgba(255, 255, 255, 0.15)", color: "white", border: "2px solid rgba(255, 255, 255, 0.3)", padding: "16px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease", backdropFilter: "blur(4px)" }} className="hero-btn-secondary">
                Conocer Más
              </button>
            </div>
            {/* Barra de búsqueda */}
            <div style={{ marginTop: "40px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", width: '100%', maxWidth: '400px' }}>
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: "rgba(255, 255, 255, 0.95)", border: "2px solid rgba(255, 255, 255, 0.2)", padding: "16px 20px 16px 50px", borderRadius: "16px", color: "#1A202C", width: "100%", fontSize: "16px", outline: "none", transition: "all 0.2s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", backdropFilter: "blur(4px)" }}
                />
                <FaSearch style={{ position: "absolute", left: "20px", color: "#64748b", fontSize: "18px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros de categoría */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap", justifyContent: "center" }}>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ background: activeCategory === cat ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "#ffffff", color: activeCategory === cat ? "#ffffff" : "#4A5568", border: "1px solid #E2E8F0", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "500", fontSize: "14px", transition: "all 0.2s ease", boxShadow: "0 4px 6px rgba(0,0,0,0.03)" }}
              className="category-btn"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cursos Section */}
        <section id="cursos-section">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", justifyContent: "center" }}>
            <div style={{ width: "4px", height: "32px", background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", borderRadius: "2px" }}></div>
            <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#1A202C" }}>
              Cursos disponibles
            </h3>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {cursosToShow.map(curso => renderCard(curso))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            {!showAllCourses && filteredCursos.length > 6 && (
              <button onClick={() => setShowAllCourses(true)} style={{ background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "white", border: "none", padding: "16px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease", boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)" }} className="more-courses-btn">
                Ver más cursos <FaArrowRight />
              </button>
            )}
            
            {showAllCourses && filteredCursos.length > 6 && (
              <button onClick={() => { setShowAllCourses(false); setTimeout(() => { document.getElementById('cursos-section').scrollIntoView({ behavior: 'smooth' }); }, 100); }} style={{ background: "#F0F0F0", color: "#1A202C", border: "1px solid #E2E8F0", padding: "16px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease" }} className="less-courses-btn">
                Ver menos cursos <FaArrowUp />
              </button>
            )}
          </div>

          {cargandoCursos && <p style={{textAlign: 'center', padding: '40px', color: '#4A5568'}}>Cargando cursos...</p>}

          {!cargandoCursos && filteredCursos.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <FaSearch style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }} />
              <h4 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                No se encontraron cursos
              </h4>
              <p>Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
            </div>
          )}
        </section>
      </main>

      {/* Modal Inscripción */}
      {inscOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: '20px' }}>
          <div style={{ background: "#ffffff", width: "min(700px, 94%)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A202C" }}>Inscribirse al curso</h3>
              <button onClick={() => setInscOpen(false)} style={{ background: "transparent", border: 0, fontSize: 24, cursor: "pointer", color: '#4A5568' }}>×</button>
            </div>
            <div style={{ padding: 16, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input placeholder="Nombre completo *" value={ins.nombreCompleto} onChange={e=>setIns({ ...ins, nombreCompleto: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px"}} />
                <input placeholder="Correo *" type="email" value={ins.correo} onChange={e=>setIns({ ...ins, correo: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px"}} />
                <input placeholder="Teléfono *" value={ins.telefono} onChange={e=>setIns({ ...ins, telefono: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px"}} />
                <input placeholder="Documento *" value={ins.documentoIdentidad} onChange={e=>setIns({ ...ins, documentoIdentidad: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px"}} />
                <input placeholder="Fecha nacimiento" type="date" value={ins.fechaNacimiento} onChange={e=>setIns({ ...ins, fechaNacimiento: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px"}} />
                <input placeholder="Ciudad" value={ins.ciudad} onChange={e=>setIns({ ...ins, ciudad: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px"}} />
                <input placeholder="Dirección" value={ins.direccion} onChange={e=>setIns({ ...ins, direccion: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px", gridColumn: "span 2"}} />
                <input placeholder="Número de tarjeta *" value={ins.numeroTarjeta} onChange={e=>setIns({ ...ins, numeroTarjeta: e.target.value })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px", gridColumn: "span 2"}} />
                <label style={{gridColumn: "span 2", fontSize: "14px", color: "#4A5568", marginTop: '8px'}}>Sube tu tarjeta de identidad (PDF)*</label>
                <input type="file" accept="application/pdf" onChange={e=>setIns({ ...ins, file: e.target.files?.[0] || null })} style={{border: "1px solid #E2E8F0", padding: "10px", borderRadius: "8px", gridColumn: "span 2"}} />
              </div>
            </div>
            <div style={{ padding: 16, display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #e5e7eb" }}>
              <button onClick={()=>setInscOpen(false)} style={{ background: "#E2E8F0", color: "#1A202C", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease" }}>Cancelar</button>
              <button onClick={submitInscripcion} disabled={insLoading} style={{ background: insLoading ? "#A0AEC0" : "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s ease" }}>{insLoading ? "Enviando..." : "Enviar solicitud"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "white", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.3)", zIndex: "1000", animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", fontWeight: "600", backdropFilter: "blur(4px)" }}>
          <FaBookmark style={{ marginRight: "10px" }} />
          Curso guardado en favoritos
        </div>
      )}

      {/* Estilos CSS-in-JS (JSX Styled) */}
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
        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.2) !important;
        }
        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          border-color: rgba(255, 255, 255, 0.6) !important;
        }
        .more-courses-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.3) !important;
        }
        .less-courses-btn:hover {
          background: #d1d5db !important;
          transform: translateY(-2px);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          h1 {
            font-size: 24px !important;
          }
          h1 span {
            font-size: 1.1em !important;
            margin-left: 6px !important;
          }
          h2 {
             font-size: 2.5rem !important;
          }
          .hero-section button {
              padding: 12px 24px !important;
              font-size: 14px !important;
          }
          .modal-content > div {
            grid-template-columns: 1fr !important;
          }
          .modal-content input, .modal-content label {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Welcome;