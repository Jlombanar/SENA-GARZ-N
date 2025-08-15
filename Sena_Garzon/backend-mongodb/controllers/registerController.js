import User from '../models/User.js';
import Instructor from '../models/Instructor.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
  const { nombre, correo, password, rol, especialidad } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ correo });
    const existingInstructor = await Instructor.findOne({ correo });

    if (existingUser || existingInstructor) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Si se registra como instructor, crear solo en la colección de instructores
    if (rol === 'instructor') {
      try {
        const nuevoInstructor = new Instructor({
          nombre: nombre,
          correo: correo,
          especialidad: especialidad || 'Sin especialidad'
        });
        await nuevoInstructor.save();
        console.log(`Instructor ${nombre} registrado en colección de instructores`);

        // Enviar correo de bienvenida
        const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #1A6C37;">¡Bienvenido a la plataforma SENA Garzón, ${nombre}!</h2>
          <p>Nos complace informarte que tu cuenta de instructor ha sido creada exitosamente con el correo: <strong>${correo}</strong>.</p>
          <p>Como instructor, podrás crear y gestionar cursos, revisar inscripciones y contribuir al desarrollo de nuestra comunidad educativa.</p>
          <p>Te invitamos a comenzar a crear contenido de calidad para nuestros estudiantes.</p>
          <p style="margin-top: 20px;">Gracias por formar parte de nuestro equipo de instructores.</p>
          <p style="color: #1A6C37;"><strong>Equipo SENA Garzón</strong></p>
        </div>
      `;
        await sendEmail(correo, '🎓 Bienvenido Instructor - SENA Garzón', html);

        const instructorWithoutPassword = {
          _id: nuevoInstructor._id,
          nombre: nuevoInstructor.nombre,
          correo: nuevoInstructor.correo,
          especialidad: nuevoInstructor.especialidad,
          rol: 'instructor'
        };

        return res.status(201).json({ 
          message: 'Instructor registrado exitosamente', 
          instructor: instructorWithoutPassword 
        });
      } catch (error) {
        console.error('Error al crear instructor:', error);
        return res.status(500).json({ message: 'Error al registrar instructor' });
      }
    }

    // Si es usuario normal, crear en la colección users
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      nombre, 
      correo, 
      password: hashedPassword,
      rol: rol || 'user',
      especialidad: especialidad || null
    });
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
      rol: newUser.rol,
      especialidad: newUser.especialidad
    };

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: userWithoutPassword });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
