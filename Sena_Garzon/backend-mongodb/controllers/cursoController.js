import Curso from '../models/Curso.js';
import fs from 'fs';
import path from 'path';

// Obtener todos los cursos
export const getCursos = async (req, res) => {
  try {
    const curso = await Curso.find();
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cursos' });
  }
};

// Obtener cursos en galería paginada
export const getCursosGallery = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const cursos = await Curso.find().skip(skip).limit(limit);
    const total = await Curso.countDocuments();

    res.json({ cursos, total });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cursos' });
  }
};

// Crear un curso
export const createCurso = async (req, res) => {
  const { nombre, cantidad, valor } = req.body;
  const imagen = req.file?.filename;

  try {
    const nuevoCurso = new Curso({ nombre, cantidad, valor, imagen });
    await nuevoCurso.save();
    res.status(201).json({ message: 'Curso creado correctamente', curso: nuevoCurso });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso' });
  }
};

// Eliminar un curso
export const deleteCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });

    if (curso.imagen) {
      const imagePath = path.join('uploads', curso.imagen);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await curso.deleteOne();
    res.json({ message: 'Curso eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso' });
  }
};

// Actualizar un curso
export const updateCurso = async (req, res) => {
  const { nombre, cantidad, valor } = req.body;

  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });

    if (req.file) {
      if (curso.imagen) {
        const oldPath = path.join('uploads', curso.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      curso.imagen = req.file.filename;
    }

    curso.nombre = nombre;
    curso.cantidad = cantidad;
    curso.valor = valor;
    await curso.save();

    res.json({ message: 'Curso actualizado', curso });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso' });
  }
};
