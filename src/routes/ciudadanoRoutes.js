import express from 'express';
import { 
    CiudadanoController, 
    buscarCiudadanoPorCredencialCivica, 
    obtenerCiudadanoPorCI 
} from '../controllers/ciudadanoController.js';

const router = express.Router();

router.get('/buscar', CiudadanoController.buscarPorCredencial);
router.post('/registrar-votante', CiudadanoController.registrarVotante);

router.get('/', buscarCiudadanoPorCredencialCivica); 
router.get('/:CI', obtenerCiudadanoPorCI); 

export default router; 