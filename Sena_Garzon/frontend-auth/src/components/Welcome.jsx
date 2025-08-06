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
            objectFit: "cover",
            borderBottom: "1px solid #3BA900"
          }}
        />
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.8rem"
        }}>
          {curso.categoria}
        </div>
      </div>
      
      <div style={{ padding: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ 
            fontSize: "1.3rem", 
            marginBottom: "0.5rem", 
            color: "#fff",
            fontWeight: "600"
          }}>
            {curso.titulo}
          </h3>
          <span style={{
            backgroundColor: "#3BA900",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontWeight: "bold"
          }}>
            {curso.nivel}
          </span>
        </div>
        
        <p style={{ 
          fontSize: "0.95rem", 
          color: "#b0b0b0",
          marginBottom: "1rem",
          lineHeight: "1.5"
        }}>
          {curso.descripcion}
        </p>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          fontSize: "0.85rem",
          color: "#888"
        }}>
          <span>Duración: {curso.duracion}</span>
          <span>⭐️⭐️⭐️⭐️☆</span>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <button
            onClick={() => handleLike(curso.id)}
            style={{
              backgroundColor: likes[curso.id] ? "#3BA900" : "#2a2a2a",
              border: likes[curso.id] ? "none" : "1px solid #3BA900",
              padding: "8px 16px",
              borderRadius: "6px",
              color: likes[curso.id] ? "#fff" : "#3BA900",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
              transform: "scale(1)"
            }}
            className="button-hover"
          >
            <FaHeart color={likes[curso.id] ? "#fff" : "#3BA900"} /> 
            {likes[curso.id] ? "Guardado" : "Guardar"}
          </button>

          {user.rol === "usuario" && (
            <button
              style={{
                backgroundColor: "#3BA900",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "transform 0.2s ease",
                transform: "scale(1)"
              }}
              className="button-hover"
            >
              <FaCheckCircle /> Inscribirse
            </button>
          )}

          {user.rol === "instructor" && (
            <>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #3BA900",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  color: "#3BA900",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "transform 0.2s ease",
                  transform: "scale(1)"
                }}
                className="button-hover"
              >
                <FaEdit /> Editar
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #e74c3c",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  color: "#e74c3c",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "transform 0.2s ease",
                  transform: "scale(1)"
                }}
                className="button-hover"
              >
                <FaTrash /> Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderHeader = () => {
    const baseStyle = {
      background: "linear-gradient(135deg, #000000 0%, #1a3a00 100%)",
      padding: "1.5rem 2rem",
      borderRadius: "12px",
      textAlign: "left",
      boxShadow: "0 8px 16px rgba(59, 169, 0, 0.2)",
      color: "white",
      marginBottom: "2rem",
      border: "1px solid #3BA900",
      position: "relative",
      overflow: "hidden",
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease"
    };

    const roleConfig = {
      admin: {
        icon: <FaUsers size={36} style={{ color: "#3BA900" }} />,
        title: "Panel de Administración",
        subtitle: "Gestiona usuarios, instructores y cursos desde este panel.",
        button: null
      },
      instructor: {
        icon: <FaChalkboardTeacher size={36} style={{ color: "#3BA900" }} />,
        title: "Panel del Instructor",
        subtitle: "Crea y gestiona tus cursos para los aprendices.",
        button: (
          <button
            style={{
              marginTop: "15px",
              backgroundColor: "#3BA900",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              transform: "scale(1)"
            }}
            className="button-hover"
          >
            <FaPlus /> Crear nuevo curso
          </button>
        )
      },
      usuario: {
        icon: <FaUserGraduate size={36} style={{ color: "#3BA900" }} />,
        title: "Explora Cursos",
        subtitle: "Encuentra el curso perfecto para tu desarrollo profesional.",
        button: null
      }
    };

    const config = roleConfig[user.rol] || {};

    return (
      <div style={baseStyle}>
        <div style={{ 
          position: "absolute", 
          top: "-50px", 
          right: "-50px", 
          width: "200px", 
          height: "200px", 
          backgroundColor: "rgba(59, 169, 0, 0.1)", 
          borderRadius: "50%",
          zIndex: 0
        }}></div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative", zIndex: 1 }}>
          {config.icon}
          <div>
            <h1 style={{ 
              margin: "0.2rem 0", 
              fontSize: "1.8rem",
              fontWeight: "700"
            }}>
              {config.title}
            </h1>
            <p style={{ 
              margin: 0,
              fontSize: "1rem",
              color: "#b0b0b0",
              maxWidth: "600px"
            }}>
              {config.subtitle}
            </p>
            {config.button}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#fff"
      }}
    >
      {/* Barra superior */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <FaBook size={28} color="#3BA900" />
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            margin: 0,
            background: "linear-gradient(to right, #3BA900, #a8ff78)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            AcademiaPlus
          </h1>
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <FaSearch style={{
              position: "absolute",
              left: "12px",
              color: "#666"
            }} />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 15px 10px 40px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                width: "250px",
                fontSize: "0.9rem",
                outline: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            />
          </div>
          
          <div 
            style={{ 
              position: "relative", 
              cursor: "pointer",
              transition: "transform 0.2s ease",
              transform: "scale(1)"
            }}
            className="button-hover"
          >
            <FaBell size={20} color="#b0b0b0" />
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "#e74c3c",
              color: "white",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6rem",
              fontWeight: "bold"
            }}>3</span>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer"
          }}>
            <img 
              src={user.avatar} 
              alt="User" 
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #3BA900"
              }} 
            />
            <span style={{ fontWeight: "500" }}>{user.nombre}</span>
          </div>
        </div>
      </div>

      {renderHeader()}
      
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span style={{
          height: "24px",
          width: "6px",
          backgroundColor: "#3BA900",
          borderRadius: "3px",
          display: "inline-block"
        }}></span>
        {user.rol === "usuario" ? "Cursos Recomendados" : 
         user.rol === "instructor" ? "Tus Cursos" : "Todos los Cursos"}
      </h2>
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.8rem",
          marginBottom: "3rem"
        }}
      >
        {filteredCursos.map((curso) => renderCard(curso))}
      </div>

      {/* Notificación */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#3BA900",
            color: "white",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards"
          }}
        >
          <FaHeart /> Curso guardado en tus favoritos
        </div>
      )}

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          .card-hover:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
          }
          
          .button-hover:hover {
            transform: scale(1.05) !important;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;