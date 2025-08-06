// models/Curso.js
import mongoose from "mongoose";

const cursoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true }, // ✅ ← Añadido
    cantidad: { type: Number, required: true },
    valor: { type: Number, required: true },
    imagen: { type: String },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Curso = mongoose.models.Curso || mongoose.model("Curso", cursoSchema);
export default Curso;
