import express from 'express';
import {
  getInstructores,
  createInstructor,
  deleteInstructor,
  updateInstructor,
} from '../controllers/instructorController.js';

const router = express.Router();

router.get('/', getInstructores);
router.post('/', createInstructor);
router.delete('/:id', deleteInstructor);
router.put('/:id', updateInstructor);

export default router;
