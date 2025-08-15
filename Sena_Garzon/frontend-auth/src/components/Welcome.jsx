import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaBook,
  FaPlus,
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSearch,
  FaBell,
  FaUserCircle
} from "react-icons/fa";

const Welcome = () => {
  const [user, setUser] = useState({});
  const [likes, setLikes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Simular carga de usuario
    const storedUser = {
      nombre: "yeffry",
      rol: "usuario", // Puede ser 'admin', 'instructor' o 'usuario'
    };
    setUser(storedUser);
  }, []);

  const handleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!likes[id]) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const cursosEjemplo = [
    {
      id: 1,
      titulo: "Programación Avanzada",
      descripcion: "Domina algoritmos, estructuras de datos y patrones de diseño.",
      imagen: "https://source.unsplash.com/400x300/?coding",
      categoria: "Tecnología",
      duracion: "8 semanas",
      nivel: "Avanzado"
    },
    {
      id: 2,
      titulo: "Diseño UX/UI Profesional",
      descripcion: "Aprende a crear interfaces centradas en el usuario con Figma y Adobe XD.",
      imagen: "https://source.unsplash.com/400x300/?design",
      categoria: "Diseño",
      duracion: "6 semanas",
      nivel: "Intermedio"
    },
    {
      id: 3,
      titulo: "Mecánica Automotriz Moderna",
      descripcion: "Tecnologías híbridas y eléctricas en la industria automotriz.",
      imagen: "https://source.unsplash.com/400x300/?car",
      categoria: "Automotriz",
      duracion: "10 semanas",
      nivel: "Principiante"
    },
    {
      id: 4,
      titulo: "Marketing Digital 360°",
      descripcion: "Estrategias integrales para redes sociales, SEO y publicidad digital.",
      imagen: "https://source.unsplash.com/400x300/?marketing",
      categoria: "Negocios",
      duracion: "12 semanas",
      nivel: "Intermedio"
    }
  ];

  const filteredCursos = cursosEjemplo.filter(curso =>
    curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCard = (curso) => (
    <div
      key={curso.id}
      style={{
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        border: "1px solid #2e2e2e",
        position: "relative",
        transform: "translateY(0)"
      }}
      className="card-hover"
    >
      <div style={{ position: "relative" }}>
        <img
          src={curso.imagen}
          alt={curso.titulo}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover"
          }}
        />
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#2e2e2e",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px"
        }}>
          {curso.categoria}
        </div>
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#00ff88",
          color: "black",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
          {curso.nivel}
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <h3 style={{
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "10px"
        }}>
          {curso.titulo}
        </h3>
        <p style={{
          color: "#cccccc",
          fontSize: "14px",
          marginBottom: "15px",
          lineHeight: "1.4"
        }}>
          {curso.descripcion}
        </p>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <span style={{
            color: "#888888",
            fontSize: "12px"
          }}>
            Duración: {curso.duracion}
          </span>
          <div style={{
            display: "flex",
            gap: "2px"
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} style={{ color: "#ffd700" }}>
                ★
              </span>
            ))}
          </div>
        </div>
        <div style={{
          display: "flex",
          gap: "10px"
        }}>
          <button
            onClick={() => handleLike(curso.id)}
            style={{
              backgroundColor: likes[curso.id] ? "#ff4757" : "#2e2e2e",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "background-color 0.3s ease"
            }}
          >
            <FaHeart style={{ fontSize: "14px" }} />
            {likes[curso.id] ? "Guardado" : "Guardar"}
          </button>
          <button style={{
            backgroundColor: "#00ff88",
            color: "black",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease"
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
      backgroundColor: "#0f0f0f",
      color: "white",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#1a1a1a",
        padding: "20px 0",
        borderBottom: "1px solid #2e2e2e"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{
              backgroundColor: "#00ff88",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              🎓
            </div>
            <h1 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#00ff88"
            }}>
              AcademiaPlus
            </h1>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px"
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
                  backgroundColor: "#2e2e2e",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  color: "white",
                  width: "250px",
                  fontSize: "14px"
                }}
              />
              <FaSearch style={{
                position: "absolute",
                right: "15px",
                color: "#888888",
                fontSize: "16px"
              }} />
            </div>
            
            <div style={{
              position: "relative",
              cursor: "pointer"
            }}>
              <FaBell style={{
                fontSize: "20px",
                color: "#00ff88"
              }} />
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#ff4757",
                color: "white",
                fontSize: "12px",
                padding: "2px 6px",
                borderRadius: "10px",
                minWidth: "18px",
                textAlign: "center"
              }}>
                3
              </span>
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer"
            }}>
              <FaUserCircle style={{
                fontSize: "24px",
                color: "#00ff88"
              }} />
              <span style={{
                fontSize: "14px",
                color: "#cccccc"
              }}>
                {user.nombre}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "60px"
        }}>
          <div style={{
            backgroundColor: "#00ff88",
            display: "inline-block",
            padding: "20px 40px",
            borderRadius: "12px",
            marginBottom: "30px"
          }}>
            <FaBook style={{
              fontSize: "40px",
              color: "#0f0f0f"
            }} />
          </div>
          <h2 style={{
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#00ff88"
          }}>
            Explora Cursos
          </h2>
          <p style={{
            fontSize: "18px",
            color: "#cccccc",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Encuentra el curso perfecto para tu desarrollo profesional.
          </p>
        </div>

        {/* Cursos Section */}
        <section>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "40px"
          }}>
            <div style={{
              width: "4px",
              height: "30px",
              backgroundColor: "#00ff88",
              borderRadius: "2px"
            }}></div>
            <h3 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#00ff88"
            }}>
              Cursos Recomendados
            </h3>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px"
          }}>
            {filteredCursos.map(renderCard)}
          </div>
        </section>
      </main>

      {/* Notification */}
      {showNotification && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#00ff88",
          color: "#0f0f0f",
          padding: "15px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 255, 136, 0.3)",
          zIndex: "1000",
          animation: "slideIn 0.3s ease"
        }}>
          <FaHeart style={{ marginRight: "8px" }} />
          Curso guardado en favoritos
        </div>
      )}

      <style jsx>{`
        .card-hover:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4) !important;
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
      `}</style>
    </div>
  );
};

export default Welcome;