import { politicoRepository } from '../repositories/index.js';
import { validateId, validateCI } from '../utils/validators.js';

export class PoliticoController {

    static async obtenerTodos(req, res, next) {
        try {
            const politicos = await politicoRepository.findAll();
            res.json(politicos);
        } catch (error) {
            next(error);
        }
    }

    static async obtenerPorCI(req, res, next) {
        try {
            const { ci } = req.params;
            
            if (!validateCI(ci)) {
                return res.status(400).json({ error: 'CI inválido' });
            }

            const politico = await politicoRepository.findByCI(ci);
            
            if (!politico) {
                return res.status(404).json({ error: 'Político no encontrado' });
            }

            res.json(politico);
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const { ci_ciudadano } = req.body;
            
            if (!ci_ciudadano) {
                return res.status(400).json({ error: 'CI del ciudadano es requerido' });
            }

            if (!validateCI(ci_ciudadano)) {
                return res.status(400).json({ error: 'CI inválido' });
            }

            const id_politico = await politicoRepository.create(ci_ciudadano);
            
            const politico = await politicoRepository.findById(id_politico);
            
            res.status(201).json({
                message: 'Político creado exitosamente',
                politico
            });
        } catch (error) {
            if (error.message.includes('no existe') || error.message.includes('ya está registrado')) {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    }

    static async eliminar(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!validateId(id)) {
                return res.status(400).json({ error: 'ID de político inválido' });
            }

            const eliminado = await politicoRepository.delete(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: 'Político no encontrado' });
            }

            res.json({ message: 'Político eliminado exitosamente' });
        } catch (error) {
            next(error);
        }
    }

    static async obtenerListasPorPolitico(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!validateId(id)) {
                return res.status(400).json({ error: 'ID de político inválido' });
            }

            const listas = await politicoRepository.findListsByPolitico(id);
            res.json(listas);
        } catch (error) {
            next(error);
        }
    }

    static async obtenerCandidatosPorLista(req, res, next) {
        try {
            const { id_lista } = req.params;
            
            if (!validateId(id_lista)) {
                return res.status(400).json({ error: 'ID de lista inválido' });
            }

            const candidatos = await politicoRepository.findCandidatesByList(id_lista);
            res.json(candidatos);
        } catch (error) {
            next(error);
        }
    }

} 