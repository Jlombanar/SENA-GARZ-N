// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

export const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user._id, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: userData,
    });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { nombre, email, telefono, especialidad, direccion, experiencia } = req.body;

    // Buscar el usuario por ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos permitidos
    if (nombre) user.nombre = nombre;
    if (email) {
      user.email = email;
      user.correo = email; // Mantener compatibilidad
    }
    if (telefono) user.telefono = telefono;
    if (especialidad) user.especialidad = especialidad;
    if (direccion) user.direccion = direccion;
    if (experiencia) user.experiencia = experiencia;

    // Guardar cambios
    await user.save();

    // Devolver usuario actualizado sin contraseña
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: userData
    });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};
