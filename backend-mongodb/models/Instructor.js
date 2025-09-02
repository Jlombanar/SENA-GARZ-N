import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  especialidad: { type: String },
}, { timestamps: true });

export default mongoose.model('Instructor', instructorSchema);
