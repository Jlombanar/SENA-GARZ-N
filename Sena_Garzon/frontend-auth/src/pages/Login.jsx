import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaHome } from "react-icons/fa";
import { initAuthSession, touchActivity } from "../utils/storage";

// Paleta de colores verde intenso
const PRIMARY_GREEN = '#2E8B57';
const DARK_GREEN = '#1F6B45';
const LIGHT_GREEN = '#3CB371';
const NEON_GREEN = '#00FF7F';
const BLACK = '#121212';
const WHITE = '#F8F8F8';

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const storedUser = raw ? JSON.parse(raw) : null;
      if (!storedUser) return;
      // Redirigir según el rol del usuario
      if (storedUser.rol === "admin") {
        navigate("/admin");
      } else if (storedUser.rol === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    } catch (_) {}
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
   const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/login`,
  { correo, password }
);


      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      initAuthSession();

      toast.success("Inicio de sesión exitoso");
      
      // Redirigir según el rol del usuario
      if (user.rol === "admin") {
        navigate("/admin");
      } else if (user.rol === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar actividad del usuario en esta pantalla (tecleo/click) para consistencia
  useEffect(() => {
    const onAnyActivity = () => touchActivity();
    window.addEventListener('click', onAnyActivity);
    window.addEventListener('keydown', onAnyActivity);
    return () => {
      window.removeEventListener('click', onAnyActivity);
      window.removeEventListener('keydown', onAnyActivity);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 overflow-hidden relative">
      {/* Efectos de fondo futuristas */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-green-500/[0.03]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-green-900 opacity-10 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-800 opacity-5 rounded-full blur-xl"></div>
      </div>

      {/* Tarjeta de login futurista */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-green-700/30 transform transition-all duration-500 hover:shadow-green-500/20 hover:border-green-500/50">
        {/* Encabezado con efecto neón */}
        <div className="relative h-28 bg-gradient-to-r from-green-900 to-green-800 flex items-center justify-center overflow-hidden border-b border-green-600/30">
          <div className="absolute inset-0 bg-green-500/10 pointer-events-none"></div>
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-500 to-transparent opacity-70"></div>
          
          <div className="flex items-center space-x-4 z-10 px-8">
            <div className="bg-white p-2 rounded-lg shadow-lg ring-2 ring-green-500/30 hover:ring-green-400/50 transition-all duration-300 hover:scale-105">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                alt="Logo SENA"
                className="h-10"
                style={{ filter: 'hue-rotate(85deg) saturate(2)' }}
              />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-100 tracking-tight">
              SENA GARZÓN
            </h2>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-green-100 mb-1">PLATAFORMA EDUCATIVA</h3>
            <p className="text-sm text-green-300/80">Ingresa con tus credenciales institucionales</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo de correo futurista */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-400 group-focus-within:text-neon-500 transition-colors">
                <FaEnvelope size={16} />
              </div>
              <input
                type="email"
                placeholder="Correo institucional"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500/30 focus:outline-none text-white placeholder-green-200/50 transition-all duration-300"
                required
              />
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-neon-500 group-focus-within:w-[calc(100%-2rem)] group-focus-within:left-4 transition-all duration-500"></div>
            </div>

            {/* Campo de contraseña futurista */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-400 group-focus-within:text-neon-500 transition-colors">
                <FaLock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500/30 focus:outline-none text-white placeholder-green-200/50 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 hover:text-neon-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-neon-500 group-focus-within:w-[calc(100%-2rem)] group-focus-within:left-4 transition-all duration-500"></div>
            </div>

            {/* Enlace de contraseña olvidada */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-xs font-medium text-green-400 hover:text-neon-500 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de login futurista */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 shadow-lg ${
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:shadow-green-500/30 active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaSignInAlt className="text-green-200" />
                  <span className="text-shadow">INICIAR SESIÓN</span>
                </span>
              )}
            </button>

            {/* Divider futurista */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-green-800/50"></div>
              <span className="flex-shrink mx-4 text-green-500/80 text-sm">O</span>
              <div className="flex-grow border-t border-green-800/50"></div>
            </div>

            {/* Enlaces adicionales */}
            <div className="flex flex-col items-center space-y-4">
              <Link 
                to="/register" 
                className="text-sm font-medium text-green-400 hover:text-neon-500 hover:underline transition-colors flex items-center"
              >
                <FaUserPlus className="mr-2" />
                Crear una cuenta nueva
              </Link>
              <Link 
                to="/" 
                className="text-sm text-green-500/80 hover:text-green-300 transition-colors flex items-center"
              >
                <FaHome className="mr-2" />
                Volver al inicio
              </Link>
            </div>
          </form>
        </div>

        {/* Pie de página con efecto neón */}
        <div className="bg-gradient-to-r from-green-900/30 to-transparent px-8 py-4 text-center border-t border-green-800/30">
          <p className="text-xs text-green-500/60">
            © {new Date().getFullYear()} SENA Regional Huila - Centro Garzón
          </p>
        </div>
      </div>

      {/* Efecto de partículas verdes (CSS puro) */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-green-500/10 animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          />
        ))}
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-100px) translateX(20px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .bg-grid-green-500\/\[0\.03\] {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%232E8B57' stroke-opacity='0.03'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .text-shadow {
          text-shadow: 0 0 8px rgba(46, 139, 87, 0.5);
        }
        .hover\:shadow-green-500\/20:hover {
          box-shadow: 0 10px 25px -5px rgba(46, 139, 87, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Login;