import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        correo,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <div className="text-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/83/Sena_Colombia_logo.svg"
            alt="Logo SENA"
            className="h-12 mx-auto mb-2"
          />
          <h2 className="text-2xl font-bold text-green-700">Ingreso a SENA Garzón</h2>
          <p className="text-sm text-gray-600">Plataforma educativa complementaria</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo institucional"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition duration-200"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-gray-600 text-sm">
            <a
              href="/forgot-password"
              className="text-green-700 hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>

          <p className="text-center text-gray-600 mt-4 text-sm">
            ¿No tienes cuenta?{' '}
            <a
              href="/register"
              className="text-green-700 hover:underline font-medium"
            >
              Regístrate
            </a>
          </p>

          <p className="text-center text-gray-600 mt-4 text-sm">
            <a href="/" className="text-green-700 hover:underline font-medium">
              Volver al inicio
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
