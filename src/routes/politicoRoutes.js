import express from 'express';
import { PoliticoController } from '../controllers/politicoController.js';

const router = express.Router();

router.get('/', PoliticoController.obtenerTodos);
router.get('/ci/:ci', PoliticoController.obtenerPorCI);
router.post('/', PoliticoController.crear);
router.delete('/:id', PoliticoController.eliminar);

router.get('/:id/listas', PoliticoController.obtenerListasPorPolitico);

router.get('/lista/:id_lista/candidatos', PoliticoController.obtenerCandidatosPorLista);

export default router; 