import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["admin", "user", "instructor", "aprendiz"],
      default: "user",
    },
    telefono: {
      type: String,
    },
    especialidad: {
      type: String,
    },
    direccion: {
      type: String,
    },
    experiencia: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

export default User;
