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
             WHERE l.id_Eleccion = ? AND l.id_Lista IS NOT NULL AND l.id_Partido IS NOT NULL
             ORDER BY l.Numero`,
            [eleccion_id]
        );
        return rows;
    }

    async findAllElections() {
        const [rows] = await pool.query(
            'SELECT * FROM Eleccion WHERE id_Eleccion IS NOT NULL ORDER BY Fecha DESC'
        );
        return rows;
    }

    async findElectionById(id_eleccion) {
        const [rows] = await pool.query(
            'SELECT * FROM Eleccion WHERE id_Eleccion = ? AND id_Eleccion IS NOT NULL',
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
             WHERE l.id_Eleccion = ? 
               AND l.id_Lista IS NOT NULL 
               AND l.id_Partido IS NOT NULL
               AND (v.id_Eleccion = ? OR v.id_Eleccion IS NULL)
               AND (v.id_Voto IS NULL OR (v.id_Voto IS NOT NULL AND v.VotoEnBlanco IS NOT NULL AND v.VotoAnulado IS NOT NULL))
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
               AND id_Voto IS NOT NULL 
               AND VotoEnBlanco IS NOT NULL 
               AND VotoAnulado IS NOT NULL
             UNION ALL
             SELECT 
                'Voto Anulado' as tipo_voto,
                COALESCE(SUM(VotoAnulado), 0) as cantidad
             FROM Voto 
             WHERE id_Eleccion = ? 
               AND id_Voto IS NOT NULL 
               AND VotoEnBlanco IS NOT NULL 
               AND VotoAnulado IS NOT NULL`,
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
             WHERE id_Eleccion = ? 
               AND id_Voto IS NOT NULL 
               AND VotoEnBlanco IS NOT NULL 
               AND VotoAnulado IS NOT NULL`,
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
               AND v.id_Voto IS NOT NULL 
               AND v.VotoEnBlanco IS NOT NULL 
               AND v.VotoAnulado IS NOT NULL
             ORDER BY v.Fecha DESC, v.Hora DESC`,
            [id_establecimiento]
        );
        return rows;
    }

    // Nuevos métodos para estadísticas por departamento y partido

    async findStatisticsByDepartment(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                d.id_Departamento,
                d.Nombre as departamento_nombre,
                COUNT(v.id_Voto) as total_votos,
                SUM(v.VotoEnBlanco) as votos_blancos,
                SUM(v.VotoAnulado) as votos_anulados,
                COUNT(v.id_Voto) - SUM(v.VotoEnBlanco) - SUM(v.VotoAnulado) as votos_validos,
                COUNT(DISTINCT e.id_Establecimiento) as total_establecimientos,
                COUNT(DISTINCT c.id_Circuito) as total_circuitos
             FROM Departamento d
             LEFT JOIN Establecimiento e ON d.id_Departamento = e.id_Departamento
             LEFT JOIN Circuito c ON d.id_Departamento = c.id_Departamento
             LEFT JOIN Voto v ON e.id_Establecimiento = v.id_Establecimiento 
               AND v.id_Eleccion = ?
               AND v.id_Voto IS NOT NULL 
               AND v.VotoEnBlanco IS NOT NULL 
               AND v.VotoAnulado IS NOT NULL
             WHERE d.id_Departamento IS NOT NULL
             GROUP BY d.id_Departamento, d.Nombre
             ORDER BY COUNT(v.id_Voto) DESC`,
            [id_eleccion]
        );
        return rows;
    }

    async findStatisticsByPoliticalParty(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                pp.id_Partido,
                pp.Nombre as partido_nombre,
                COUNT(cv.id_ContenidoVoto) as total_votos,
                COUNT(DISTINCT l.id_Lista) as total_listas,
                ROUND((COUNT(cv.id_ContenidoVoto) * 100.0) / 
                    (SELECT COUNT(*) FROM Voto WHERE id_Eleccion = ? 
                     AND id_Voto IS NOT NULL 
                     AND VotoEnBlanco IS NOT NULL 
                     AND VotoAnulado IS NOT NULL 
                     AND VotoEnBlanco = 0 AND VotoAnulado = 0), 2) as porcentaje_votos_validos
             FROM PartidoPolitico pp
             LEFT JOIN Lista l ON pp.id_Partido = l.id_Partido AND l.id_Eleccion = ?
             LEFT JOIN ContenidoVoto cv ON l.id_Lista = cv.id_Lista
             LEFT JOIN Voto v ON cv.id_Voto = v.id_Voto 
               AND v.id_Eleccion = ?
               AND v.id_Voto IS NOT NULL 
               AND v.VotoEnBlanco IS NOT NULL 
               AND v.VotoAnulado IS NOT NULL
             WHERE pp.id_Partido IS NOT NULL
             GROUP BY pp.id_Partido, pp.Nombre
             HAVING COUNT(cv.id_ContenidoVoto) > 0
             ORDER BY COUNT(cv.id_ContenidoVoto) DESC`,
            [id_eleccion, id_eleccion, id_eleccion]
        );
        return rows;
    }

    async findDetailedStatisticsByDepartment(id_eleccion, id_departamento) {
        const [rows] = await pool.query(
            `SELECT 
                d.Nombre as departamento_nombre,
                c.Nombre as circuito_nombre,
                c.Numero as circuito_numero,
                e.Nombre as establecimiento_nombre,
                COUNT(v.id_Voto) as total_votos,
                SUM(v.VotoEnBlanco) as votos_blancos,
                SUM(v.VotoAnulado) as votos_anulados,
                COUNT(v.id_Voto) - SUM(v.VotoEnBlanco) - SUM(v.VotoAnulado) as votos_validos
             FROM Departamento d
             JOIN Circuito c ON d.id_Departamento = c.id_Departamento
             JOIN Establecimiento e ON c.id_Circuito = e.id_Circuito
             LEFT JOIN Voto v ON e.id_Establecimiento = v.id_Establecimiento 
               AND v.id_Eleccion = ?
               AND v.id_Voto IS NOT NULL 
               AND v.VotoEnBlanco IS NOT NULL 
               AND v.VotoAnulado IS NOT NULL
             WHERE d.id_Departamento = ? 
               AND d.id_Departamento IS NOT NULL
               AND c.id_Circuito IS NOT NULL
               AND e.id_Establecimiento IS NOT NULL
             GROUP BY d.id_Departamento, c.id_Circuito, e.id_Establecimiento
             ORDER BY c.Numero, e.Nombre`,
            [id_eleccion, id_departamento]
        );
        return rows;
    }

    async findVotesByDepartmentAndParty(id_eleccion) {
        const [rows] = await pool.query(
            `SELECT 
                d.id_Departamento,
                d.Nombre as departamento_nombre,
                pp.id_Partido,
                pp.Nombre as partido_nombre,
                COUNT(cv.id_ContenidoVoto) as total_votos,
                ROUND((COUNT(cv.id_ContenidoVoto) * 100.0) / 
                    NULLIF((SELECT COUNT(*) FROM Voto v2 
                            JOIN Establecimiento e2 ON v2.id_Establecimiento = e2.id_Establecimiento 
                            WHERE v2.id_Eleccion = ? 
                              AND e2.id_Departamento = d.id_Departamento 
                              AND v2.id_Voto IS NOT NULL 
                              AND v2.VotoEnBlanco IS NOT NULL 
                              AND v2.VotoAnulado IS NOT NULL
                              AND v2.VotoEnBlanco = 0 AND v2.VotoAnulado = 0), 0), 2) as porcentaje_departamento
             FROM Departamento d
             JOIN Establecimiento e ON d.id_Departamento = e.id_Departamento
             JOIN Voto v ON e.id_Establecimiento = v.id_Establecimiento
             JOIN ContenidoVoto cv ON v.id_Voto = cv.id_Voto
             JOIN Lista l ON cv.id_Lista = l.id_Lista
             JOIN PartidoPolitico pp ON l.id_Partido = pp.id_Partido
             WHERE v.id_Eleccion = ?
               AND d.id_Departamento IS NOT NULL
               AND e.id_Establecimiento IS NOT NULL
               AND v.id_Voto IS NOT NULL 
               AND v.VotoEnBlanco IS NOT NULL 
               AND v.VotoAnulado IS NOT NULL
               AND cv.id_ContenidoVoto IS NOT NULL
               AND l.id_Lista IS NOT NULL
               AND pp.id_Partido IS NOT NULL
             GROUP BY d.id_Departamento, d.Nombre, pp.id_Partido, pp.Nombre
             ORDER BY d.Nombre, COUNT(cv.id_ContenidoVoto) DESC`,
            [id_eleccion, id_eleccion]
        );
        return rows;
    }

    async findPartyRankingByDepartment(id_eleccion, id_departamento) {
        const [rows] = await pool.query(
            `SELECT 
                pp.id_Partido,
                pp.Nombre as partido_nombre,
                COUNT(cv.id_ContenidoVoto) as total_votos,
                COUNT(DISTINCT l.id_Lista) as total_listas_departamento,
                ROUND((COUNT(cv.id_ContenidoVoto) * 100.0) / 
                    NULLIF((SELECT COUNT(*) FROM Voto v2 
                            JOIN Establecimiento e2 ON v2.id_Establecimiento = e2.id_Establecimiento 
                            WHERE v2.id_Eleccion = ? 
                              AND e2.id_Departamento = ? 
                              AND v2.id_Voto IS NOT NULL 
                              AND v2.VotoEnBlanco IS NOT NULL 
                              AND v2.VotoAnulado IS NOT NULL
                              AND v2.VotoEnBlanco = 0 AND v2.VotoAnulado = 0), 0), 2) as porcentaje_departamento
             FROM PartidoPolitico pp
             LEFT JOIN Lista l ON pp.id_Partido = l.id_Partido AND l.id_Eleccion = ?
             LEFT JOIN ContenidoVoto cv ON l.id_Lista = cv.id_Lista
             LEFT JOIN Voto v ON cv.id_Voto = v.id_Voto
             LEFT JOIN Establecimiento e ON v.id_Establecimiento = e.id_Establecimiento
             WHERE e.id_Departamento = ? 
               AND v.id_Eleccion = ?
               AND pp.id_Partido IS NOT NULL
               AND e.id_Establecimiento IS NOT NULL
               AND (v.id_Voto IS NULL OR (v.id_Voto IS NOT NULL AND v.VotoEnBlanco IS NOT NULL AND v.VotoAnulado IS NOT NULL))
             GROUP BY pp.id_Partido, pp.Nombre
             HAVING COUNT(cv.id_ContenidoVoto) > 0
             ORDER BY COUNT(cv.id_ContenidoVoto) DESC`,
            [id_eleccion, id_departamento, id_eleccion, id_departamento, id_eleccion]
        );
        return rows;
    }
} 