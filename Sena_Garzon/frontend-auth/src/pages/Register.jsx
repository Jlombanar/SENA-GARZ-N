import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

// Colores oficiales del SENA
const SENA_GREEN = '#3C8A34';
const SENA_WHITE = '#FFFFFF';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "aprendiz",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      if (storedUser.rol === "admin") {
        navigate("/admin-dashboard");
      } else if (storedUser.rol === "instructor") {
        navigate("/instructor-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/register", formData);
      toast.success("Usuario registrado correctamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      {/* Diseño de fondo innovador */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#3C8A34] to-[#3C8A34]/80"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#3C8A34]/10 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#3C8A34]/20 rounded-full"></div>
      </div>

      {/* Tarjeta de registro */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Encabezado con efecto de onda */}
        <div className="relative h-24 bg-[#3C8A34] flex items-center justify-center">
          <div className="absolute -bottom-1 w-full">
            <svg viewBox="0 0 500 20" className="w-full h-8">
              <path 
                d="M0,10 C150,25 350,-5 500,10 L500,0 L0,0 Z" 
                fill="#FFFFFF"
              ></path>
            </svg>
          </div>
          <div className="flex items-center space-x-3 z-10">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
                alt="Logo SENA"
                className="h-10"
              />
            </div>
            <h2 className="text-2xl font-bold text-white">Registro</h2>
          </div>
        </div>

        <div className="p-8">
          <p className="text-center text-gray-600 mb-6">
            Crea tu cuenta para acceder a la plataforma educativa del SENA Garzón
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo de nombre */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3C8A34]">
                <FaUser size={16} />
              </div>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-[#3C8A34] focus:outline-none bg-transparent transition duration-200"
                required
              />
            </div>

            {/* Campo de correo */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3C8A34]">
                <FaEnvelope size={16} />
              </div>
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-[#3C8A34] focus:outline-none bg-transparent transition duration-200"
                required
              />
            </div>

            {/* Campo de contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3C8A34]">
                <FaLock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border-b-2 border-gray-300 focus:border-[#3C8A34] focus:outline-none bg-transparent transition duration-200"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-[#3C8A34] transition duration-200"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-[#3C8A34] text-white px-6 py-3 rounded-lg hover:bg-[#2d6a28] transition duration-200 shadow-md hover:shadow-lg"
            >
              <span>Registrarse</span>
              <FaArrowRight />
            </button>

            {/* Enlaces adicionales */}
            <div className="flex flex-col items-center space-y-3 mt-6">
              <Link 
                to="/login" 
                className="text-sm text-[#3C8A34] hover:underline font-medium flex items-center"
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Link>
              <Link 
                to="/" 
                className="text-sm text-gray-600 hover:text-[#3C8A34] transition duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;