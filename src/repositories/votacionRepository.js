import { pool } from '../config/database.js';

export class VotacionRepository {

    async createVote(id_eleccion, id_establecimiento, voto_en_blanco = false, voto_anulado = false, connection = null) {
        // Convertir booleanos a 1 o 0 para MySQL
        const votoEnBlancoValue = voto_en_blanco ? 1 : 0;
        const votoAnuladoValue = voto_anulado ? 1 : 0;
        
        const dbConnection = connection || pool;
        const [result] = await dbConnection.query(
            'INSERT INTO Voto (id_Eleccion, id_Establecimiento, VotoEnBlanco, VotoAnulado) VALUES (?, ?, ?, ?)',
            [id_eleccion, id_establecimiento, votoEnBlancoValue, votoAnuladoValue]
        );
        
        console.log('Repository - Voto insertado con ID:', result.insertId);
        return result.insertId;
    }

    async createVoteContent(id_voto, id_lista = null, id_papeleta = null, connection = null) {
        const dbConnection = connection || pool;
        const [result] = await dbConnection.query(
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

    async findAllElections() {
        const [rows] = await pool.query('SELECT * FROM Eleccion ORDER BY Fecha DESC');
        return rows;
    }

    async findElectionById(id_eleccion) {
        const [rows] = await pool.query(
            'SELECT * FROM Eleccion WHERE id_Eleccion = ?',
            [id_eleccion]
        );
        return rows[0] || null;
    }

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

    async findSpecialVotes(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                'Voto en Blanco' as tipo_voto,
                COALESCE(SUM(VotoEnBlanco), 0) as cantidad
             FROM Voto 
             WHERE id_Eleccion = ?
             UNION ALL
             SELECT 
                'Voto Anulado' as tipo_voto,
                COALESCE(SUM(VotoAnulado), 0) as cantidad
             FROM Voto 
             WHERE id_Eleccion = ?`,
            [id_eleccion, id_eleccion]
        );
        return rows;
    }

    async findVotingStatistics(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                COUNT(*) as total_votos,
                SUM(VotoEnBlanco) as votos_blancos,
                SUM(VotoAnulado) as votos_anulados,
                COUNT(*) - SUM(VotoEnBlanco) - SUM(VotoAnulado) as votos_validos
             FROM Voto 
             WHERE id_Eleccion = ?`,
            [id_eleccion]
        );
        return rows[0];
    }

    async findVotesByEstablishment(id_establecimiento) {
        const [rows] = await pool.query(
            `SELECT 
                v.*,
                cv.id_Lista,
                cv.id_Papeleta,
                l.Numero as numero_lista,
                pp.Nombre as partido_nombre
             FROM Voto v
             LEFT JOIN ContenidoVoto cv ON v.id_Voto = cv.id_Voto
             LEFT JOIN Lista l ON cv.id_Lista = l.id_Lista
             LEFT JOIN PartidoPolitico pp ON l.id_Partido = pp.id_Partido
             WHERE v.id_Establecimiento = ?
             ORDER BY v.Fecha DESC, v.Hora DESC`,
            [id_establecimiento]
        );
        return rows;
    }
} 