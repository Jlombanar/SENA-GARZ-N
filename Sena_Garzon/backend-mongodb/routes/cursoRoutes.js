import express from 'express';
import {
  getCursos,
  getCursosInstructor,
  createCurso,
  deleteCurso,
  updateCurso,
  getCursosGallery,
  inscribirseCurso,
  getInscripcionesCurso,
  revisarInscripcion,
  eliminarInscripcion,
  toggleLike,
  getCursosPorLikes,
  getEstadisticasLikes
} from '../controllers/cursoController.js';
import { verificarToken, esInstructor, esUsuarioAutenticado } from '../middleware/authMiddleware.js';
import upload from "../middleware/multer.js";

const router = express.Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'API de cursos funcionando correctamente' });
});

router.get('/', getCursos);
router.get('/instructor', verificarToken, esInstructor, getCursosInstructor);
router.get('/galeria', getCursosGallery);
router.get('/top-likes', getCursosPorLikes);
router.get('/estadisticas-likes', getEstadisticasLikes);
router.post('/', verificarToken, esInstructor, createCurso);
router.put('/:id', verificarToken, esInstructor, updateCurso);
router.delete('/:id', verificarToken, esInstructor, deleteCurso);

// Sistema de likes
router.post('/:id/like', verificarToken, esUsuarioAutenticado, toggleLike);

// Ruta de inscripción para usuarios autenticados
router.post(
  "/:id/inscribirse",
  verificarToken,
  esUsuarioAutenticado,
  upload.single("tarjetaPDF"),
  inscribirseCurso
);

// Rutas para gestión de inscripciones (instructores)
router.get('/:id/inscripciones', verificarToken, esInstructor, getInscripcionesCurso);
router.put('/:cursoId/inscripciones/:inscripcionId/revisar', verificarToken, esInstructor, revisarInscripcion);
router.delete('/:cursoId/inscripciones/:inscripcionId', verificarToken, esUsuarioAutenticado, eliminarInscripcion);

export default router;
