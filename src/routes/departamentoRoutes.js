import express from 'express';
import { DepartamentoController } from '../controllers/departamentoController.js';

const router = express.Router();

// Rutas para Departamentos
router.get('/departamentos', DepartamentoController.obtenerTodos);
router.get('/departamentos/:id', DepartamentoController.obtenerPorId);
router.get('/departamentos/estadisticas/completas', DepartamentoController.obtenerConEstadisticas);

router.get('/circuitos/:id', DepartamentoController.obtenerCircuitoPorId);

router.get('/establecimientos/:id', DepartamentoController.obtenerEstablecimientoPorId);

export default router; 