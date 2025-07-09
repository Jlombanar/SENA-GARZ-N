import User from "../models/User.js";
import Curso from "../models/Curso.js";
import fs from "fs";
import path from "path";

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

    user.nombre = nombre || user.nombre;
    user.correo = correo || user.correo;
    user.rol = rol || user.rol;

    const updatedUser = await user.save();

    res.json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
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
