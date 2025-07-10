import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/reset-password/${token}`, {
        password,
      });

      toast.success("Contraseña actualizada. Inicia sesión");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar contraseña");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sena-100 px-4" style={{backgroundColor: '#F2F9F1'}}>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border-t-4" style={{borderTopColor: '#39B54A'}}>
        <div className="text-center mb-6">
          <img 
            src="https://www.sena.edu.co/es-co/PublishingImages/logo-sena-naranja.png" 
            alt="Logo SENA" 
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold" style={{color: '#39B54A'}}>Restablecer Contraseña</h2>
          <p className="text-gray-600 mt-2">Ingresa y confirma tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#39B54A'}}>
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                style={{borderColor: '#39B54A'}}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                style={{color: '#39B54A'}}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{color: '#39B54A'}}>
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                style={{borderColor: '#39B54A'}}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                style={{color: '#39B54A'}}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button 
            className="w-full py-2 rounded-lg font-medium text-white hover:shadow-md transition-all duration-300"
            style={{backgroundColor: '#39B54A'}}
            type="submit"
          >
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;