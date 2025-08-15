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

// Obtener cursos de un instructor específico
export const getCursosInstructor = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const instructorId = req.user._id;
    const cursos = await Curso.find({ instructorId: instructorId });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos del instructor:", error);
    res.status(500).json({ message: "Error al obtener cursos del instructor" });
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
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Verificar si ya está inscrito (en cualquier estado)
    const yaInscrito = curso.inscritos && curso.inscritos.some(
      (inscripcion) => inscripcion.userId.toString() === req.user._id.toString()
    );
    
    if (yaInscrito) {
      return res.status(400).json({ message: "Ya tienes una solicitud de inscripción para este curso" });
    }

    // Verificar que se haya subido el archivo PDF
    if (!req.file) {
      return res.status(400).json({ message: "Archivo PDF requerido" });
    }

    // Verificar campos obligatorios
    const camposObligatorios = ['nombreCompleto', 'correo', 'telefono', 'documentoIdentidad', 'numeroTarjeta'];
    for (const campo of camposObligatorios) {
      if (!req.body[campo]) {
        return res.status(400).json({ message: `Campo ${campo} es requerido` });
      }
    }

    const tarjetaPDFUrl = `/uploads/${req.file.filename}`;

    // Crear la nueva inscripción con estado pendiente
    const nuevaInscripcion = {
      userId: req.user._id,
      // Datos personales
      nombreCompleto: req.body.nombreCompleto,
      correo: req.body.correo,
      telefono: req.body.telefono,
      documentoIdentidad: req.body.documentoIdentidad,
      fechaNacimiento: req.body.fechaNacimiento ? new Date(req.body.fechaNacimiento) : null,
      direccion: req.body.direccion || '',
      ciudad: req.body.ciudad || '',
      
      // Datos de la inscripción
      numeroTarjeta: req.body.numeroTarjeta,
      tarjetaPDFUrl,
      fechaInscripcion: new Date(),
      estado: 'pendiente' // Por defecto pendiente
    };

    // Inicializar el array de inscritos si no existe
    if (!curso.inscritos) {
      curso.inscritos = [];
    }

    curso.inscritos.push(nuevaInscripcion);
    await curso.save();

    res.status(200).json({ 
      message: "Solicitud de inscripción enviada correctamente. Está pendiente de revisión por el instructor.",
      inscripcion: nuevaInscripcion
    });
  } catch (error) {
    console.error("Error en inscripción:", error);
    res.status(500).json({ message: "Error al enviar la solicitud de inscripción" });
  }
};

// Sistema de likes
export const toggleLike = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Información del usuario para el like
    const userInfo = {
      nombre: req.user.nombre || req.user.username || '',
      email: req.user.email || ''
    };

    const likeAgregado = curso.toggleLike(req.user._id, userInfo);
    await curso.save();

    res.json({ 
      message: likeAgregado ? "Like agregado" : "Like removido",
      likesCount: curso.getLikesCount(),
      hasLiked: curso.hasUserLiked(req.user._id),
      estadisticas: curso.getEstadisticas()
    });
  } catch (error) {
    console.error("Error en toggle like:", error);
    res.status(500).json({ message: "Error al procesar like" });
  }
};

// Obtener cursos ordenados por likes
export const getCursosPorLikes = async (req, res) => {
  try {
    const cursos = await Curso.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } }
        }
      },
      {
        $sort: { likesCount: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos por likes:", error);
    res.status(500).json({ message: "Error al obtener cursos" });
  }
};

// Obtener estadísticas de likes
export const getEstadisticasLikes = async (req, res) => {
  try {
    const estadisticas = await Curso.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalCursos: { $sum: 1 },
          totalLikes: { $sum: "$likesCount" },
          promedioLikes: { $avg: "$likesCount" },
          cursoConMasLikes: { $max: "$likesCount" },
          cursoConMenosLikes: { $min: "$likesCount" }
        }
      }
    ]);

    // Obtener el curso con más likes
    const cursoTop = await Curso.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } }
        }
      },
      {
        $sort: { likesCount: -1 }
      },
      {
        $limit: 1
      }
    ]);

    res.json({
      estadisticas: estadisticas[0] || {},
      cursoTop: cursoTop[0] || null
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

// Obtener inscripciones de un curso (para instructores) - CORREGIDO
export const getInscripcionesCurso = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Verificar que el usuario sea el instructor del curso
    if (curso.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Solo el instructor puede ver las inscripciones" });
    }

    // Si no hay inscripciones, retornar array vacío
    if (!curso.inscritos || curso.inscritos.length === 0) {
      return res.json({ inscripciones: [] });
    }

    // Obtener inscripciones con información del usuario
    const inscripcionesConUsuario = await Curso.aggregate([
      { $match: { _id: curso._id } },
      { $unwind: "$inscritos" },
      {
        $lookup: {
          from: "users",
          localField: "inscritos.userId",
          foreignField: "_id",
          as: "usuarioInfo"
        }
      },
      {
        $project: {
          inscripcion: "$inscritos",
          usuarioInfo: { $arrayElemAt: ["$usuarioInfo", 0] }
        }
      }
    ]);

    res.json({ 
      inscripciones: inscripcionesConUsuario.map(item => ({
        ...item.inscripcion,
        usuario: item.usuarioInfo
      }))
    });
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    res.status(500).json({ message: "Error al obtener las inscripciones" });
  }
};

// Aprobar o rechazar una inscripción
export const revisarInscripcion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { cursoId, inscripcionId } = req.params;
    const { estado, observaciones } = req.body;

    if (!['aprobada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ message: "Estado debe ser 'aprobada' o 'rechazada'" });
    }

    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Verificar que el usuario sea el instructor del curso
    if (curso.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Solo el instructor puede revisar inscripciones" });
    }

    // Buscar la inscripción
    const inscripcion = curso.inscritos.id(inscripcionId);
    if (!inscripcion) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    // Actualizar el estado
    inscripcion.estado = estado;
    inscripcion.observacionesInstructor = observaciones || '';
    inscripcion.fechaRevision = new Date();
    inscripcion.instructorRevisor = req.user._id;

    await curso.save();

    res.json({ 
      message: `Inscripción ${estado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente`,
      inscripcion 
    });
  } catch (error) {
    console.error("Error al revisar inscripción:", error);
    res.status(500).json({ message: "Error al revisar la inscripción" });
  }
};

// Eliminar una inscripción (rechazada o por solicitud del usuario)
export const eliminarInscripcion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { cursoId, inscripcionId } = req.params;
    const curso = await Curso.findById(cursoId);
    
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Buscar la inscripción
    const inscripcion = curso.inscritos.id(inscripcionId);
    if (!inscripcion) {
      return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    // Verificar permisos: solo el instructor o el propio usuario pueden eliminar
    const esInstructor = curso.instructorId.toString() === req.user._id.toString();
    const esPropietario = inscripcion.userId.toString() === req.user._id.toString();

    if (!esInstructor && !esPropietario) {
      return res.status(403).json({ message: "No tienes permisos para eliminar esta inscripción" });
    }

    // Eliminar la inscripción del array
    curso.inscritos = curso.inscritos.filter(ins => ins._id.toString() !== inscripcionId);
    await curso.save();

    res.json({ message: "Inscripción eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar inscripción:", error);
    res.status(500).json({ message: "Error al eliminar la inscripción" });
  }
};
