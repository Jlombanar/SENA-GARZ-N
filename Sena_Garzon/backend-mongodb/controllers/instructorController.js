import Instructor from '../models/Instructor.js';

export const getInstructores = async (req, res) => {
  try {
    const instructores = await Instructor.find();
    res.json(instructores);
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
    await Instructor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Instructor eliminado' });
  } catch (err) {
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
