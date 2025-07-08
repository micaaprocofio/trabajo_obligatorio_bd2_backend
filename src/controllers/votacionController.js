import { votacionRepository } from '../repositories/index.js';
import { pool } from '../config/database.js';

export class VotacionController {
    
    static async emitirVoto(req, res) {
        const connection = await pool.getConnection();
        
        try {
            const { id_eleccion, id_establecimiento, id_lista, voto_en_blanco, voto_anulado } = req.body;

            if (!id_eleccion || !id_establecimiento) {
                return res.status(400).json({ 
                    error: 'Faltan parámetros requeridos (id_eleccion, id_establecimiento).' 
                });
            }
            
            const opcionesSeleccionadas = [
                !!id_lista,
                !!voto_en_blanco,
                !!voto_anulado
            ].filter(Boolean).length;

            if (opcionesSeleccionadas !== 1) {
                return res.status(400).json({ 
                    error: 'Debe seleccionar exactamente una opción: lista, voto en blanco o voto anulado.' 
                });
            }

            await connection.beginTransaction();

            const id_voto = await votacionRepository.createVote(
                id_eleccion, 
                id_establecimiento, 
                voto_en_blanco, 
                voto_anulado,
                connection 
            );

            console.log('Controller - Voto creado con ID:', id_voto);

            const [verificacion] = await connection.query(
                'SELECT * FROM Voto WHERE id_Voto = ?',
                [id_voto]
            );
            console.log('Controller - Verificación inmediata del voto insertado:', verificacion[0]);

            if (id_lista) {
                await votacionRepository.createVoteContent(id_voto, id_lista, null, connection);
                console.log('Controller - Contenido de voto creado para lista:', id_lista);
            }

            await connection.commit();
            res.status(201).json({ 
                message: 'Voto emitido exitosamente.', 
                id_voto 
            });

        } catch (error) {
            await connection.rollback();
            console.error('Controller - Error al emitir voto:', error);
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

    static async obtenerEstadisticasVotacion(req, res) {
        try {
            const { id_eleccion } = req.params;
            
            if (!id_eleccion) {
                return res.status(400).json({ error: 'El parámetro "id_eleccion" es requerido.' });
            }

            const estadisticas = await votacionRepository.findVotingStatistics(id_eleccion);
            res.json(estadisticas);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }

    static async obtenerVotosPorEstablecimiento(req, res) {
        try {
            const { id_establecimiento } = req.params;
            
            if (!id_establecimiento) {
                return res.status(400).json({ error: 'El parámetro "id_establecimiento" es requerido.' });
            }

            const votos = await votacionRepository.findVotesByEstablishment(id_establecimiento);
            res.json(votos);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }

} 