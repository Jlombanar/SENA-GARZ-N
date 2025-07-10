import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ correo });

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, correo, password: hashedPassword });
    await newUser.save();

    // Enviar correo de bienvenida
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #1A6C37;">¡Bienvenido a la plataforma SENA Garzón, ${nombre}!</h2>
    <p>Nos complace informarte que tu cuenta ha sido creada exitosamente con el correo: <strong>${correo}</strong>.</p>
    <p>A partir de ahora podrás acceder a nuestra plataforma de formación, donde encontrarás una variedad de <strong>cursos complementarios</strong> diseñados para fortalecer tus habilidades y conocimientos.</p>
    <p>Te invitamos a explorar los contenidos, inscribirte en los cursos de tu interés y continuar creciendo con el respaldo del <strong>SENA Garzón</strong>.</p>
    <p style="margin-top: 20px;">Gracias por formar parte de nuestra comunidad de aprendizaje.</p>
    <p style="color: #1A6C37;"><strong>Equipo SENA Garzón</strong></p>
  </div>
`;
await sendEmail(correo, '🎓 Bienvenido a SENA Garzón - Plataforma de Cursos Complementarios', html);

    const userWithoutPassword = {
      _id: newUser._id,
      nombre: newUser.nombre,
      correo: newUser.correo,
    };

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: userWithoutPassword });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
