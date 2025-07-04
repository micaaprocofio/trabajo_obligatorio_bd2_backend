import express from 'express';
import { AutoridadController } from '../controllers/autoridadController.js';

const router = express.Router();

// Rutas para autoridades
router.post('/validar', AutoridadController.validarAutoridad);
export default router; 