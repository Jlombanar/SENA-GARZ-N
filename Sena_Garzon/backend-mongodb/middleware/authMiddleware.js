// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

export const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Token vacío' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

export const esInstructor = (req, res, next) => {
  if (req.user && req.user.rol === 'instructor') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso solo para instructores' });
  }
};

// Nuevo middleware para usuarios autenticados (cualquier rol)
export const esUsuarioAutenticado = (req, res, next) => {
  if (req.user && (req.user.rol === 'user' || req.user.rol === 'aprendiz' || req.user.rol === 'admin' || req.user.rol === 'instructor')) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado' });
  }
};

export const esAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso solo para administradores' });
  }
};
