// middleware/multer.js
import multer from "multer";
import path from "path";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // carpeta donde guardar
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Filtro de archivos: PDFs para inscripciones, imágenes para avatar
const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === "application/pdf";
  const isImage = file.mimetype.startsWith("image/");
  // Permitir ambos tipos; la ruta decidirá qué acepta
  if (isPdf || isImage) return cb(null, true);
  return cb(new Error("Archivo no permitido"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
