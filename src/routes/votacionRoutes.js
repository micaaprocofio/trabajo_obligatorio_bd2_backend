import express from 'express';
import { VotacionController } from '../controllers/votacionController.js';

const router = express.Router();

router.post('/votar', VotacionController.emitirVoto);
router.get('/listas', VotacionController.obtenerListasPorEleccion);
router.get('/elecciones', VotacionController.obtenerElecciones);
router.get('/elecciones/:id_eleccion', VotacionController.obtenerEleccionPorId);
router.get('/resultados/:id_eleccion', VotacionController.obtenerResultadosPorEleccion);
router.get('/especiales/:id_eleccion', VotacionController.obtenerVotosEspeciales);
router.get('/estadisticas/:id_eleccion', VotacionController.obtenerEstadisticasVotacion);
router.get('/votos/:id_establecimiento', VotacionController.obtenerVotosPorEstablecimiento);

router.get('/estadisticas/:id_eleccion/departamentos', VotacionController.obtenerEstadisticasPorDepartamento);
router.get('/estadisticas/:id_eleccion/partidos', VotacionController.obtenerEstadisticasPorPartido);
router.get('/estadisticas/:id_eleccion/departamentos/:id_departamento', VotacionController.obtenerEstadisticasDetalladasPorDepartamento);
router.get('/estadisticas/:id_eleccion/departamentos-partidos', VotacionController.obtenerVotosPorDepartamentoYPartido);
router.get('/estadisticas/:id_eleccion/departamentos/:id_departamento/ranking-partidos', VotacionController.obtenerRankingPartidosPorDepartamento);
router.get('/estadisticas/:id_eleccion/resumen-completo', VotacionController.obtenerResumenEstadisticasCompleto);

export default router; 