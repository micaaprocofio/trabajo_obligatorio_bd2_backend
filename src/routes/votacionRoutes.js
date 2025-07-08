import express from 'express';
import { VotacionController } from '../controllers/votacionController.js';

const router = express.Router();

// Rutas para votación
router.post('/votar', VotacionController.emitirVoto);
router.get('/listas', VotacionController.obtenerListasPorEleccion);
router.get('/elecciones', VotacionController.obtenerElecciones);
router.get('/elecciones/:id_eleccion', VotacionController.obtenerEleccionPorId);
router.get('/resultados/:id_eleccion', VotacionController.obtenerResultadosPorEleccion);
router.get('/especiales/:id_eleccion', VotacionController.obtenerVotosEspeciales);
router.get('/estadisticas/:id_eleccion', VotacionController.obtenerEstadisticasVotacion);
router.get('/votos/:id_establecimiento', VotacionController.obtenerVotosPorEstablecimiento);

export default router; 