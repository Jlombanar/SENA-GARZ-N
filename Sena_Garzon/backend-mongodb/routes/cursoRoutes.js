import express from 'express';
import {
  getCursos,         // ✅ Correcto
  createCurso,
  deleteCurso,
  updateCurso,
  getCursosGallery   // si también lo necesitas
} from '../controllers/cursoController.js';

const router = express.Router();

// Endpoints
router.get('/', getCursos);
router.post('/', createCurso);
router.delete('/:id', deleteCurso);
router.put('/:id', updateCurso);

// Si usas galería paginada
router.get('/galeria', getCursosGallery);

export default router;
