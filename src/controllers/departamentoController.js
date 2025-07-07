import { departamentoRepository } from '../repositories/index.js';
import { validateId } from '../utils/validators.js';

export class DepartamentoController {

    static async obtenerTodos(req, res, next) {
        try {
            const departamentos = await departamentoRepository.findAll();
            res.json(departamentos);
        } catch (error) {
            next(error);
        }
    }

    static async obtenerPorId(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!validateId(id)) {
                return res.status(400).json({ error: 'ID de departamento inválido' });
            }

            const departamento = await departamentoRepository.findById(id);
            
            if (!departamento) {
                return res.status(404).json({ error: 'Departamento no encontrado' });
            }

            res.json(departamento);
        } catch (error) {
            next(error);
        }
    }

    static async obtenerConEstadisticas(req, res, next) {
        try {
            const departamentos = await departamentoRepository.findWithStatistics();
            res.json(departamentos);
        } catch (error) {
            next(error);
        }
    }

    static async obtenerCircuitoPorId(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!validateId(id)) {
                return res.status(400).json({ error: 'ID de circuito inválido' });
            }

            const circuito = await departamentoRepository.findCircuitById(id);
            
            if (!circuito) {
                return res.status(404).json({ error: 'Circuito no encontrado' });
            }

            res.json(circuito);
        } catch (error) {
            next(error);
        }
    }

    static async obtenerEstablecimientoPorId(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!validateId(id)) {
                return res.status(400).json({ error: 'ID de establecimiento inválido' });
            }

            const establecimiento = await departamentoRepository.findEstablishmentById(id);
            
            if (!establecimiento) {
                return res.status(404).json({ error: 'Establecimiento no encontrado' });
            }

            res.json(establecimiento);
        } catch (error) {
            next(error);
        }
    }

} 