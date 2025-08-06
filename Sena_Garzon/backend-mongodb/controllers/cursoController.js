import Curso from "../models/Curso.js";

// Obtener todos los cursos
export const getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cursos" });
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
    res.status(500).json({ message: "Error al obtener cursos" });
  }
};

// Crear nuevo curso (solo instructores)
export const createCurso = async (req, res) => {
  const { nombre, descripcion, cantidad, valor, imagen } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const instructorId = req.user._id;

    const nuevoCurso = new Curso({
      nombre,
      descripcion,
      cantidad,
      valor,
      imagen,
      instructorId,
    });

    await nuevoCurso.save();
    res.status(201).json({ message: "Curso creado correctamente", curso: nuevoCurso });
  } catch (error) {
    console.error("Error en crear curso:", error);
    res.status(500).json({ message: "Error al crear el curso" });
  }
};

// Eliminar un curso
export const deleteCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    await curso.deleteOne();
    res.json({ message: "Curso eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso" });
  }
};

// Actualizar un curso
export const updateCurso = async (req, res) => {
  const { nombre, descripcion, cantidad, valor, imagen } = req.body;

  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    curso.nombre = nombre;
    curso.descripcion = descripcion;
    curso.cantidad = cantidad;
    curso.valor = valor;
    if (imagen) curso.imagen = imagen;

    await curso.save();
    res.json({ message: "Curso actualizado", curso });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el curso" });
  }
};

export const inscribirseCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    const yaInscrito = curso.inscritos.some(
      (i) => i.userId.toString() === req.user._id.toString()
    );
    if (yaInscrito) {
      return res.status(400).json({ message: "Ya estás inscrito en este curso" });
    }

    const tarjetaPDFUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!tarjetaPDFUrl) {
      return res.status(400).json({ message: "Archivo PDF faltante" });
    }

    const nuevaInscripcion = {
      userId: req.user._id,
      numeroTarjeta: req.body.numeroTarjeta,
      tarjetaPDFUrl
    };

    curso.inscritos.push(nuevaInscripcion);
    await curso.save();

    res.status(200).json({ message: "Inscripción exitosa" });
  } catch (error) {
    console.error("Error inscripción:", error);
    res.status(500).json({ message: "Error al inscribirse" });
  }
};
