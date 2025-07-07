import { votacionRepository } from '../repositories/index.js';
import { pool } from '../config/database.js';

export class VotacionController {
    
    static async emitirVoto(req, res) {
        const connection = await pool.getConnection();
        
        try {
            const { id_eleccion, id_establecimiento, id_lista, id_papeleta, observado } = req.body;

            if (!id_eleccion || !id_establecimiento || (id_lista === undefined && id_papeleta === undefined)) {
                return res.status(400).json({ 
                    error: 'Faltan parámetros requeridos (id_eleccion, id_establecimiento, y id_lista o id_papeleta).' 
                });
            }

            await connection.beginTransaction();

            const id_voto = await votacionRepository.createVote(id_eleccion, id_establecimiento, observado);
            await votacionRepository.createVoteContent(id_voto, id_lista, id_papeleta);

            await connection.commit();
            res.status(201).json({ 
                message: 'Voto emitido exitosamente.', 
                id_voto 
            });

        } catch (error) {
            await connection.rollback();
            res.status(500).json({ 
                error: 'Error interno del servidor', 
                details: error.message 
            });
        } finally {
            connection.release();
        }
    }

    static async obtenerListasPorEleccion(req, res) {
        try {
            const { eleccion_id } = req.query;
            
            if (!eleccion_id) {
                return res.status(400).json({ 
                    error: 'El parámetro "eleccion_id" es requerido.' 
                });
            }

            const listas = await votacionRepository.findListsByElection(eleccion_id);
            res.json(listas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error interno del servidor', 
                details: error.message 
            });
        }
    }

    static async obtenerPapeletasEspeciales(req, res) {
        try {
            const papeletas = await votacionRepository.findSpecialBallots();
            res.json(papeletas);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error interno del servidor', 
                details: error.message 
            });
        }
    }

    static async obtenerElecciones(req, res) {
        try {
            const elecciones = await votacionRepository.findAllElections();
            res.json(elecciones);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }

    static async obtenerEleccionPorId(req, res) {
        try {
            const { id_eleccion } = req.params;
            
            if (!id_eleccion) {
                return res.status(400).json({ error: 'El parámetro "id_eleccion" es requerido.' });
            }

            const eleccion = await votacionRepository.findElectionById(id_eleccion);
            
            if (eleccion) {
                res.json(eleccion);
            } else {
                res.status(404).json({ error: 'Elección no encontrada.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }

    static async obtenerResultadosPorEleccion(req, res) {
        try {
            const { id_eleccion } = req.params;
            
            if (!id_eleccion) {
                return res.status(400).json({ error: 'El parámetro "id_eleccion" es requerido.' });
            }

            const resultados = await votacionRepository.findResultsByElection(id_eleccion);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }

    static async obtenerVotosEspeciales(req, res) {
        try {
            const { id_eleccion } = req.params;
            
            if (!id_eleccion) {
                return res.status(400).json({ error: 'El parámetro "id_eleccion" es requerido.' });
            }

            const votosEspeciales = await votacionRepository.findSpecialVotes(id_eleccion);
            res.json(votosEspeciales);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }
} 