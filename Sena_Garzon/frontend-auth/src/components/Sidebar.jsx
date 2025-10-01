import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaDashcube,
  FaSignOutAlt,
  FaHome,
  FaGraduationCap,
} from "react-icons/fa";

const Sidebar = ({ user: propUser, onLogout, menuOpen, setMenuOpen }) => {
  const [user, setUser] = useState(propUser || null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!propUser) {
      try {
        const raw = localStorage.getItem("user");
        const storedUser = raw ? JSON.parse(raw) : null;
        if (storedUser) setUser(storedUser);
      } catch (_) {
        setUser(null);
      }
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  const isAdmin = user?.rol === "admin";
  const isInstructor = user?.rol === "instructor";
  const isUser = user?.rol === "user" || user?.rol === "aprendiz";

  const adminItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/admin" },
    { name: "Usuarios", icon: <FaUser />, path: "/admin/users" },
    { name: "Cursos", icon: <FaBox />, path: "/admin/cursos" },
  ];

  const instructorItems = [
    { name: "Dashboard", icon: <FaDashcube />, path: "/instructor" },
    { name: "Mis Cursos", icon: <FaBox />, path: "/instructor/cursos" },
    { name: "Perfil", icon: <FaUser />, path: "/instructor/perfil" },
  ];

  const userItems = [
    { name: "Bienvenidos", icon: <FaDashcube />, path: "/dashboard" },
    { name: "Mis Curso", icon: <FaBox />, path: "/dashboard/miscurso" },
    { name: "Perfil", icon: <FaUser />, path: "/dashboard/profile" },
  ];

  const menuItems = isAdmin
    ? adminItems
    : isInstructor
    ? instructorItems
    : isUser
    ? userItems
    : [];

  const allMenuItems = [{ name: "Inicio", icon: <FaHome />, path: "/" }, ...menuItems];

  return (
    <>
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 30
          }}
          className="md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed md:sticky md:top-0 z-40 h-screen transition-all duration-300 transform ${
          isCollapsed ? "w-20" : "w-80"
        } ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div style={{
          height: '100%',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fdf9 100%)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 20px rgba(76, 175, 80, 0.08)',
          borderRight: '1px solid rgba(76, 175, 80, 0.1)'
        }}>

          {/* Header - Logo */}
          <div style={{
            padding: '28px 24px',
            borderBottom: '1px solid rgba(76, 175, 80, 0.12)',
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
          }}>
            <div className="flex justify-between items-center">
              {!isCollapsed && (
                <Link to="/" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: '800',
                  fontSize: '26px',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  textDecoration: 'none'
                }}>
                  <FaGraduationCap style={{ fontSize: '32px' }} />
                  <span>SENA Garzón</span>
                </Link>
              )}
              {isCollapsed && (
                <FaGraduationCap style={{ fontSize: '28px', color: '#ffffff', margin: '0 auto' }} />
              )}
              <button
                onClick={() => setMenuOpen(false)}
                className="md:hidden"
                style={{
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderBottom: '1px solid rgba(76, 175, 80, 0.12)',
            background: '#ffffff'
          }}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid #4CAF50',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
                }}
              />
            ) : (
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)'
              }}>
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            {!isCollapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p style={{
                  fontSize: '12px',
                  color: '#4CAF50',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  Bienvenido
                </p>
                <p style={{
                  fontWeight: '700',
                  fontSize: '16px',
                  color: '#1A202C',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '6px'
                }}>
                  {user?.nombre || "Usuario"}
                </p>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  color: '#2E7D32',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  display: 'inline-block',
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  {user?.rol || "usuario"}
                </span>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav style={{
            flex: 1,
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto'
          }}>
            {allMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    background: isActive 
                      ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' 
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#4b5563',
                    fontWeight: isActive ? '700' : '600',
                    boxShadow: isActive ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: isCollapsed ? 0 : '14px'
                  }}
                  className="nav-item"
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {isActive && !isCollapsed && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '60%',
                      background: '#ffffff',
                      borderRadius: '0 4px 4px 0'
                    }} />
                  )}
                  <span style={{
                    fontSize: '20px',
                    color: isActive ? '#ffffff' : '#4CAF50',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span style={{
                      fontSize: '15px',
                      letterSpacing: '0.2px'
                    }}>
                      {item.name}
                    </span>
                  )}
                  {isCollapsed && (
                    <div style={{
                      position: 'absolute',
                      left: '100%',
                      marginLeft: '12px',
                      whiteSpace: 'nowrap',
                      padding: '8px 12px',
                      background: '#2E7D32',
                      color: '#ffffff',
                      fontSize: '13px',
                      borderRadius: '8px',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    className="tooltip"
                    >
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{
            padding: '20px 16px',
            borderTop: '1px solid rgba(76, 175, 80, 0.12)',
            background: '#ffffff'
          }}>
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
              }}
            >
              <FaSignOutAlt style={{ fontSize: '18px' }} />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        nav::-webkit-scrollbar {
          width: 6px;
        }

        nav::-webkit-scrollbar-track {
          background: rgba(76, 175, 80, 0.05);
          border-radius: 10px;
        }

        nav::-webkit-scrollbar-thumb {
          background: rgba(76, 175, 80, 0.3);
          border-radius: 10px;
        }

        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(76, 175, 80, 0.5);
        }

        .nav-item:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;