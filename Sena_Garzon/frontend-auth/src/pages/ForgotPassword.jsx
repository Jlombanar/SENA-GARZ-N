import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [correo, setCorreo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/forgot-password", { correo });
      toast.success("Revisa tu correo para restablecer tu contraseña");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar el correo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo registrado"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Enviar correo de recuperación
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
