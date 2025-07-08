import { pool } from '../config/database.js';

export class PoliticoRepository {

    async findAll() {
        const [rows] = await pool.query(
            `SELECT p.*, c.CI, c.CredencialCivica, c.NombreCompleto, c.FechaNacimiento
             FROM Politico p
             JOIN Ciudadano c ON p.CI_Ciudadano = c.CI
             ORDER BY c.NombreCompleto`
        );
        return rows;
    }

    async findById(id_politico) {
        const [rows] = await pool.query(
            `SELECT p.*, c.CI, c.CredencialCivica, c.NombreCompleto, c.FechaNacimiento
             FROM Politico p
             JOIN Ciudadano c ON p.CI_Ciudadano = c.CI
             WHERE p.id_Politico = ?`,
            [id_politico]
        );
        return rows[0] || null;
    }

    async findByCI(CI_Ciudadano) {
        const [rows] = await pool.query(
            `SELECT p.*, c.CI, c.CredencialCivica, c.NombreCompleto, c.FechaNacimiento
             FROM Politico p
             JOIN Ciudadano c ON p.CI_Ciudadano = c.CI
             WHERE c.CI = ?`,
            [CI_Ciudadano]
        );
        return rows[0] || null;
    }

    async create(CI_Ciudadano) {
        const [ciudadano] = await pool.query(
            'SELECT CI FROM Ciudadano WHERE CI = ?',
            [CI_Ciudadano]
        );
        
        if (ciudadano.length === 0) {
            throw new Error('El ciudadano especificado no existe');
        }

        const [existePolitico] = await pool.query(
            'SELECT id_Politico FROM Politico WHERE CI_Ciudadano = ?',
            [CI_Ciudadano]
        );
        
        if (existePolitico.length > 0) {
            throw new Error('Este ciudadano ya está registrado como político');
        }

        const [result] = await pool.query(
            'INSERT INTO Politico (CI_Ciudadano) VALUES (?)',
            [CI_Ciudadano]
        );
        return result.insertId;
    }

    async delete(id_politico) {
        const [result] = await pool.query(
            'DELETE FROM Politico WHERE id_Politico = ?',
            [id_politico]
        );
        return result.affectedRows > 0;
    }


    async findListsByPolitico(id_politico) {
        const [rows] = await pool.query(
            `SELECT 
                l.*,
                pp.Nombre as partido_nombre,
                e.Nombre as eleccion_nombre,
                e.Fecha as eleccion_fecha,
                e.TipoEleccion,
                lpp.Rol
             FROM Lista_PartidoPolitico lpp
             JOIN Lista l ON lpp.id_Lista = l.id_Lista
             JOIN PartidoPolitico pp ON l.id_Partido = pp.id_Partido
             JOIN Eleccion e ON l.id_Eleccion = e.id_Eleccion
             WHERE lpp.id_Politico = ?
             ORDER BY e.Fecha DESC, l.Numero`,
            [id_politico]
        );
        return rows;
    }

    async findCandidatesByList(id_lista) {
        const [rows] = await pool.query(
            `SELECT 
                p.*,
                c.CI,
                c.CredencialCivica,
                c.NombreCompleto,
                c.FechaNacimiento,
                lpp.Rol
             FROM Lista_PartidoPolitico lpp
             JOIN Politico p ON lpp.id_Politico = p.id_Politico
             JOIN Ciudadano c ON p.CI_Ciudadano = c.CI
             WHERE lpp.id_Lista = ?
             ORDER BY 
                CASE lpp.Rol
                    WHEN 'Presidente' THEN 1
                    WHEN 'Vicepresidente' THEN 2
                    WHEN 'Senador' THEN 3
                    WHEN 'Diputado' THEN 4
                    ELSE 5
                END,
                c.NombreCompleto`,
            [id_lista]
        );
        return rows;
    }

} 