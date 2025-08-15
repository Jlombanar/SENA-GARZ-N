import User from "../models/User.js";
import Curso from "../models/Curso.js";
import Instructor from "../models/Instructor.js";
import fs from "fs";
import path from "path";

// ─── MIGRACIÓN TEMPORAL ─────────────────────────────────────────────
export const migrarInstructores = async (req, res) => {
  try {
    // Buscar todos los usuarios con rol instructor
    const usuariosInstructores = await User.find({ rol: 'instructor' });
    
    if (usuariosInstructores.length === 0) {
      return res.json({ message: 'No hay instructores para migrar', count: 0 });
    }

    let migrados = 0;
    const errores = [];

    for (const usuario of usuariosInstructores) {
      try {
        // Verificar si ya existe en la colección de instructores
        const instructorExistente = await Instructor.findOne({ correo: usuario.correo });
        
        if (!instructorExistente) {
          // Crear nuevo instructor
          const nuevoInstructor = new Instructor({
            nombre: usuario.nombre || 'Instructor',
            correo: usuario.correo,
            especialidad: usuario.especialidad || 'Sin especialidad'
          });
          
          await nuevoInstructor.save();
          migrados++;
          
          console.log(`Usuario ${usuario.nombre} migrado a instructor`);
        } else {
          console.log(`Usuario ${usuario.nombre} ya existe como instructor`);
        }
      } catch (error) {
        errores.push({ usuario: usuario.nombre, error: error.message });
        console.error(`Error migrando usuario ${usuario.nombre}:`, error);
      }
    }

    res.json({
      message: `Migración completada. ${migrados} instructores migrados.`,
      migrados,
      total: usuariosInstructores.length,
      errores
    });

  } catch (error) {
    console.error('Error en migración:', error);
    res.status(500).json({ message: 'Error en migración', error: error.message });
  }
};

// ─── ESTADÍSTICAS DASHBOARD ───────────────────────────────────────
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsuarios, totalInstructores, cursos] = await Promise.all([
      User.countDocuments({}),
      Instructor.countDocuments({}), // Solo instructores de la colección instructors
      Curso.find({}, 'inscritos likes').lean()
    ]);

    const totalCursos = cursos.length;
    const totalInscripciones = cursos.reduce((acc, c) => acc + (c.inscritos?.length || 0), 0);
    const totalLikes = cursos.reduce((acc, c) => acc + (c.likes?.length || 0), 0);
    const pendientes = cursos.reduce(
      (acc, c) => acc + (c.inscritos?.filter(i => i.estado === 'pendiente').length || 0),
      0
    );

    res.json({
      totalUsuarios,
      totalInstructores,
      totalCursos,
      totalInscripciones,
      totalLikes,
      pendientes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas admin:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// ─── NOTIFICACIONES RECIENTES ───────────────────────────────────────
export const getAdminNotifications = async (req, res) => {
  try {
    const [usuariosRecientes, instructoresRecientes, cursosRecientes, inscripcionesPendientes] = await Promise.all([
      User.find({}, 'nombre correo rol createdAt') // Solo usuarios normales, no instructores
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Instructor.find({}, 'nombre correo especialidad createdAt') // Instructores recientes
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Curso.find({}, 'nombre createdAt')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Curso.aggregate([
        { $unwind: '$inscritos' },
        { $match: { 'inscritos.estado': 'pendiente' } },
        { $lookup: { from: 'users', localField: 'inscritos.userId', foreignField: '_id', as: 'user' } },
        { $project: { 
          nombreCurso: '$nombre', 
          nombreUsuario: { $arrayElemAt: ['$user.nombre', 0] },
          fecha: '$inscritos.fechaInscripcion'
        }},
        { $sort: { fecha: -1 } },
        { $limit: 3 }
      ])
    ]);

    const notificaciones = [];

    // Usuarios recientes (solo usuarios normales, no instructores)
    usuariosRecientes.forEach(user => {
      const tiempo = getTiempoRelativo(user.createdAt);
      notificaciones.push({
        id: `user_${user._id}`,
        tipo: 'usuario',
        titulo: `Nuevo usuario registrado`,
        descripcion: `${user.nombre || 'Usuario'} se registró`,
        tiempo,
        color: 'bg-blue-50',
        iconColor: 'bg-blue-500'
      });
    });

    // Instructores recientes
    instructoresRecientes.forEach(instructor => {
      const tiempo = getTiempoRelativo(instructor.createdAt);
      notificaciones.push({
        id: `instructor_${instructor._id}`,
        tipo: 'instructor',
        titulo: `Nuevo instructor registrado`,
        descripcion: `${instructor.nombre || 'Instructor'} se registró como instructor`,
        tiempo,
        color: 'bg-purple-50',
        iconColor: 'bg-purple-500'
      });
    });

    // Cursos recientes
    cursosRecientes.forEach(curso => {
      const tiempo = getTiempoRelativo(curso.createdAt);
      notificaciones.push({
        id: `curso_${curso._id}`,
        tipo: 'curso',
        titulo: 'Nuevo curso creado',
        descripcion: `Curso "${curso.nombre}" fue creado`,
        tiempo,
        color: 'bg-green-50',
        iconColor: 'bg-green-500'
      });
    });

    // Inscripciones pendientes
    inscripcionesPendientes.forEach(inscripcion => {
      const tiempo = getTiempoRelativo(inscripcion.fecha);
      notificaciones.push({
        id: `inscripcion_${inscripcion._id}`,
        tipo: 'inscripcion',
        titulo: 'Nueva inscripción pendiente',
        descripcion: `${inscripcion.nombreUsuario || 'Usuario'} se inscribió a "${inscripcion.nombreCurso}"`,
        tiempo,
        color: 'bg-yellow-50',
        iconColor: 'bg-yellow-500'
      });
    });

    // Ordenar por fecha más reciente
    notificaciones.sort((a, b) => new Date(b.tiempo) - new Date(a.tiempo));
    
    res.json(notificaciones.slice(0, 6)); // Máximo 6 notificaciones
  } catch (error) {
    console.error('Error al obtener notificaciones admin:', error);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

// Función auxiliar para calcular tiempo relativo
function getTiempoRelativo(fecha) {
  const ahora = new Date();
  const diferencia = ahora - new Date(fecha);
  const minutos = Math.floor(diferencia / 60000);
  const horas = Math.floor(diferencia / 3600000);
  const dias = Math.floor(diferencia / 86400000);

  if (minutos < 1) return 'Hace un momento';
  if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
}

//
// ─── USUARIOS ──────────────────────────────────────────────────────
//

// ✅ Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ✅ Eliminar usuario por ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

// ✅ Editar usuario por ID
export const updateUser = async (req, res) => {
  const { nombre, correo, rol } = req.body;

  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const rolAnterior = user.rol;
    
    // Si el rol cambió a instructor, crear registro en colección de instructores y eliminar de users
    if (rol === 'instructor' && rolAnterior !== 'instructor') {
      try {
        // Verificar si ya existe un instructor con ese correo
        const instructorExistente = await Instructor.findOne({ correo: user.correo });
        
        if (!instructorExistente) {
          const nuevoInstructor = new Instructor({
            nombre: user.nombre || 'Instructor',
            correo: user.correo,
            especialidad: user.especialidad || 'Sin especialidad'
          });
          await nuevoInstructor.save();
          console.log(`Usuario ${user.nombre} promovido a instructor y agregado a colección de instructores`);
          
          // Eliminar el usuario de la colección users
          await User.findByIdAndDelete(userId);
          console.log(`Usuario ${user.nombre} eliminado de la colección users`);
          
          return res.json({
            message: "Usuario promovido a instructor exitosamente",
            instructor: nuevoInstructor,
            action: "promoted_to_instructor"
          });
        }
      } catch (error) {
        console.error('Error al crear instructor:', error);
        return res.status(500).json({ message: 'Error al promover a instructor' });
      }
    }

    // Si el rol cambió de instructor a otro, eliminar de la colección de instructores
    if (rolAnterior === 'instructor' && rol !== 'instructor') {
      try {
        // Buscar el instructor en la colección de instructores
        const instructor = await Instructor.findOne({ correo: user.correo });
        
        if (instructor) {
          // Crear nuevo usuario en la colección users
          const bcrypt = (await import('bcrypt')).default;
          
          // Generar contraseña temporal
          const passwordTemporal = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
          
          const nuevoUsuario = new User({
            nombre: instructor.nombre,
            correo: instructor.correo,
            password: hashedPassword,
            rol: rol,
            especialidad: instructor.especialidad
          });
          
          await nuevoUsuario.save();
          
          // Eliminar de la colección de instructores
          await Instructor.findOneAndDelete({ correo: user.correo });
          
          console.log(`Instructor ${instructor.nombre} restaurado como usuario con contraseña temporal: ${passwordTemporal}`);
          
          return res.json({
            message: "Instructor removido y restaurado como usuario",
            usuario: {
              nombre: nuevoUsuario.nombre,
              correo: nuevoUsuario.correo,
              passwordTemporal: passwordTemporal
            },
            action: "restored_as_user"
          });
        }
      } catch (error) {
        console.error('Error al restaurar instructor como usuario:', error);
        return res.status(500).json({ message: 'Error al restaurar instructor como usuario' });
      }
    }

    // Solo actualizar si no se cambió a instructor (porque ya se eliminó)
    if (rol !== 'instructor' || rolAnterior === 'instructor') {
      user.nombre = nombre || user.nombre;
      user.correo = correo || user.correo;
      user.rol = rol || user.rol;

      const updatedUser = await user.save();

      res.json({
        message: "Usuario actualizado correctamente",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

//
// ─── CURSO ─────────────────────────────────────────────────────────
//

// ✅ Obtener todos los cursos
export const getAllCurso = async (req, res) => {
  try {
    const curso = await Curso.find();
    res.json(curso);
  } catch (error) {
    console.error("Error al obtener curso:", error);
    res.status(500).json({ message: "Error al obtener curso" });
  }
};

// ✅ Crear nuevo curso
export const createCurso = async (req, res) => {
  const { nombre, cantidad, valor } = req.body;
  const imagen = req.file?.filename;

  try {
    const nuevoCurso = new Curso({ nombre, cantidad, valor, imagen });
    await nuevoCurso.save();
    res.status(201).json({
      message: "Curso creado correctamente",
      curso: nuevoCurso,
    });
  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({ message: "Error al crear curso" });
  }
};

// ✅ Eliminar curso por ID
export const deleteCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (curso.imagen) {
      const imagePath = path.join("uploads", curso.imagen);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await curso.deleteOne();
    res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ message: "Error al eliminar curso" });
  }
};

// ✅ Editar curso por ID
export const updateCurso = async (req, res) => {
  const { nombre, cantidad, valor } = req.body;

  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (req.file) {
      if (curso.imagen) {
        const oldImagePath = path.join("uploads", curso.imagen);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      curso.imagen = req.file.filename;
    }

    curso.nombre = nombre || curso.nombre;
    curso.cantidad = cantidad || curso.cantidad;
    curso.valor = valor || curso.valor;

    const updatedCurso = await curso.save();

    res.json({
      message: "Curso actualizado correctamente",
      curso: updatedCurso,
    });
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    res.status(500).json({ message: "Error al actualizar curso" });
  }
};
