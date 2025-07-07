import { pool } from '../config/database.js';

export class VotacionRepository {

    async createVote(id_eleccion, id_establecimiento) {
        const [result] = await pool.query(
            'INSERT INTO Voto (id_Eleccion, id_Establecimiento) VALUES (?, ?)',
            [id_eleccion, id_establecimiento]
        );
        return result.insertId;
    }

    async createVoteContent(id_voto, id_lista = null, id_papeleta = null) {
        const [result] = await pool.query(
            'INSERT INTO ContenidoVoto (id_Voto, id_Lista, id_Papeleta) VALUES (?, ?, ?)',
            [id_voto, id_lista, id_papeleta]
        );
        return result.insertId;
    }


    async findListsByElection(eleccion_id) {
        const [rows] = await pool.query(
            `SELECT l.id_Lista, l.Numero, l.Nombre, pp.Nombre as partido_nombre 
             FROM Lista l 
             JOIN PartidoPolitico pp ON l.id_Partido = pp.id_Partido
             WHERE l.id_Eleccion = ?
             ORDER BY l.Numero`,
            [eleccion_id]
        );
        return rows;
    }

    /**
     * Obtener papeletas especiales (voto en blanco, anulado, observado)
     * @returns {Array} - Lista de papeletas especiales
     */
    async findSpecialBallots() {
        const [rows] = await pool.query(
            "SELECT * FROM Papeleta WHERE nombre_opcion IN ('Voto en Blanco', 'Voto Anulado', 'Voto Observado')"
        );
        return rows;
    }

   
    /**
     * Obtener una elección por ID
     * @param {number} id_eleccion - ID de la elección
     * @returns {Object|null} - Datos de la elección o null si no existe
     */
    async findElectionById(id_eleccion) {
        const [rows] = await pool.query(
            'SELECT * FROM Eleccion WHERE id_Eleccion = ?',
            [id_eleccion]
        );
        return rows[0] || null;
    }

    /**
     * Obtener resultados de una elección
     * @param {number} id_eleccion - ID de la elección
     * @returns {Array} - Resultados ordenados por cantidad de votos
     */
    async findResultsByElection(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                l.Numero as numero_lista,
                l.Nombre as nombre_lista,
                pp.Nombre as partido_nombre,
                COUNT(cv.id_ContenidoVoto) as total_votos
             FROM Lista l
             LEFT JOIN PartidoPolitico pp ON l.id_Partido = pp.id_Partido
             LEFT JOIN ContenidoVoto cv ON l.id_Lista = cv.id_Lista
             LEFT JOIN Voto v ON cv.id_Voto = v.id_Voto
             WHERE l.id_Eleccion = ? AND (v.id_Eleccion = ? OR v.id_Eleccion IS NULL)
             GROUP BY l.id_Lista, pp.id_Partido
             ORDER BY COUNT(cv.id_ContenidoVoto) DESC`,
            [id_eleccion, id_eleccion]
        );
        return rows;
    }

    /**
     * Obtener votos especiales de una elección
     * @param {number} id_eleccion - ID de la elección
     * @returns {Array} - Votos especiales (blancos, anulados, observados)
     */
    async findSpecialVotes(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                p.nombre_opcion as tipo_voto,
                COUNT(cv.id_ContenidoVoto) as cantidad
             FROM Papeleta p
             LEFT JOIN ContenidoVoto cv ON p.id_Papeleta = cv.id_Papeleta
             LEFT JOIN Voto v ON cv.id_Voto = v.id_Voto
             WHERE v.id_Eleccion = ? OR v.id_Eleccion IS NULL
             GROUP BY p.id_Papeleta
             ORDER BY cantidad DESC`,
            [id_eleccion]
        );
        return rows;
    }

} 