import express from 'express';
import {
  getCursos,
  createCurso,
  deleteCurso,
  updateCurso,
  getCursosGallery,
  inscribirseCurso
} from '../controllers/cursoController.js';
import { verificarToken, esInstructor } from '../middleware/authMiddleware.js';
import upload from "../middleware/multer.js";

const router = express.Router();

router.get('/', getCursos);
router.get('/galeria', getCursosGallery);
router.post('/', verificarToken, esInstructor, createCurso);
router.put('/:id', verificarToken, esInstructor, updateCurso);
router.delete('/:id', verificarToken, esInstructor, deleteCurso);

// ✅ RUTA CORRECTA PARA INSCRIBIRSE (con multer)
router.post('/:id/inscribirse', verificarToken, upload.single("tarjetaPDF"), inscribirseCurso);

export default router;
