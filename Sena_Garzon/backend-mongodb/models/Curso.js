// models/Curso.js
import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    cantidad: { type: Number, required: true },
    // valor eliminado para cursos gratuitos
    imagen: { type: String },
    categoria: { type: String, default: 'general' },
    duracion: { type: String, default: 'Por definir' },
    modalidad: { type: String, default: 'Por definir' },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Sistema de likes mejorado
    likes: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      fechaLike: {
        type: Date,
        default: Date.now
      },
      // Información adicional del usuario que dio like
      nombreUsuario: String,
      emailUsuario: String
    }],
    inscritos: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      // Datos personales del aspirante
      nombreCompleto: String,
      correo: String,
      telefono: String,
      documentoIdentidad: String,
      fechaNacimiento: Date,
      direccion: String,
      ciudad: String,
      
      // Datos de la inscripción
      numeroTarjeta: String,
      tarjetaPDFUrl: String,
      fechaInscripcion: {
        type: Date,
        default: Date.now
      },
      estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada'],
        default: 'pendiente'
      },
      observacionesInstructor: String,
      fechaRevision: Date,
      instructorRevisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }]
  },
  { timestamps: true }
);

// Método para obtener el conteo de likes
cursoSchema.methods.getLikesCount = function() {
  return this.likes ? this.likes.length : 0;
};

// Método para verificar si un usuario ya dio like
cursoSchema.methods.hasUserLiked = function(userId) {
  if (!this.likes) return false;
  return this.likes.some(like => like.userId.toString() === userId.toString());
};

// Método para agregar/quitar like
cursoSchema.methods.toggleLike = function(userId, userInfo = {}) {
  if (!this.likes) {
    this.likes = [];
  }
  
  const likeIndex = this.likes.findIndex(like => like.userId.toString() === userId.toString());
  
  if (likeIndex > -1) {
    // Quitar like
    this.likes.splice(likeIndex, 1);
    return false; // like removido
  } else {
    // Agregar like
    this.likes.push({ 
      userId, 
      fechaLike: new Date(),
      nombreUsuario: userInfo.nombre || '',
      emailUsuario: userInfo.email || ''
    });
    return true; // like agregado
  }
};

// Método para obtener estadísticas del curso
cursoSchema.methods.getEstadisticas = function() {
  return {
    totalLikes: this.getLikesCount(),
    totalInscritos: this.inscritos ? this.inscritos.length : 0,
    inscripcionesPendientes: this.inscritos ? this.inscritos.filter(i => i.estado === 'pendiente').length : 0,
    inscripcionesAprobadas: this.inscritos ? this.inscritos.filter(i => i.estado === 'aprobada').length : 0,
    inscripcionesRechazadas: this.inscritos ? this.inscritos.filter(i => i.estado === 'rechazada').length : 0
  };
};

const Curso = mongoose.models.Curso || mongoose.model("Curso", cursoSchema);
export default Curso;


