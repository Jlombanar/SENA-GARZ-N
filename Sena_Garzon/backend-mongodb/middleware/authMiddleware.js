import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verificarToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado' });
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

export const esInstructor = (req, res, next) => {
  if (req.user && req.user.rol === 'instructor') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso solo para instructores' });
  }
};
