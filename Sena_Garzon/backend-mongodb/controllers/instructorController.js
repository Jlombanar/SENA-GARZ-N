import Instructor from '../models/Instructor.js';
import User from '../models/User.js';

export const getInstructores = async (req, res) => {
  try {
    // Solo instructores de la colección Instructor (ya no hay instructores en users)
    const instructores = await Instructor.find().lean();

    const instructoresFormateados = instructores.map((i) => ({
      _id: i._id,
      nombre: i.nombre,
      correo: i.correo,
      especialidad: i.especialidad || '',
      esUsuario: false, // Todos son instructores de la colección instructors
    }));

    res.json(instructoresFormateados);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener instructores' });
  }
};

export const createInstructor = async (req, res) => {
  try {
    const { nombre, correo, especialidad } = req.body;
    const nuevo = new Instructor({ nombre, correo, especialidad });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear instructor' });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { esUsuario } = req.body;

    if (esUsuario) {
      // Si es un usuario instructor, restaurarlo como usuario regular
      const instructor = await Instructor.findById(id);
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor no encontrado' });
      }

      try {
        // Crear nuevo usuario en la colección users
        const User = (await import('../models/User.js')).default;
        const bcrypt = (await import('bcrypt')).default;
        
        // Generar contraseña temporal
        const passwordTemporal = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
        
        const nuevoUsuario = new User({
          nombre: instructor.nombre,
          correo: instructor.correo,
          password: hashedPassword,
          rol: 'user',
          especialidad: instructor.especialidad
        });
        
        await nuevoUsuario.save();
        
        // Eliminar de la colección de instructores
        await Instructor.findByIdAndDelete(id);
        
        console.log(`Instructor ${instructor.nombre} restaurado como usuario con contraseña temporal: ${passwordTemporal}`);
        
        res.json({ 
          message: 'Instructor removido y restaurado como usuario',
          usuario: {
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            passwordTemporal: passwordTemporal
          },
          action: "restored_as_user"
        });
      } catch (error) {
        console.error('Error al restaurar instructor como usuario:', error);
        res.status(500).json({ message: 'Error al restaurar instructor como usuario' });
      }
    } else {
      // Si es un instructor manual, eliminarlo de la colección Instructor
      const deleted = await Instructor.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Instructor no encontrado para eliminar' });
      }
      res.json({ message: 'Instructor eliminado' });
    }
  } catch (err) {
    console.error('Error al eliminar instructor:', err);
    res.status(500).json({ message: 'Error al eliminar instructor' });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const updated = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar instructor' });
  }
};
