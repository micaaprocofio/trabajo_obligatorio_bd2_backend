import { pool } from '../config/database.js';

export class DepartamentoRepository {
    
    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM Departamento ORDER BY Nombre'
        );
        return rows;
    }

    async findById(id_departamento) {
        const [rows] = await pool.query(
            'SELECT * FROM Departamento WHERE id_Departamento = ?',
            [id_departamento]
        );
        return rows[0] || null;
    }

    async findWithStatistics() {
        const [rows] = await pool.query(
            `SELECT 
                d.*,
                COUNT(DISTINCT c.id_Circuito) as total_circuitos,
                COUNT(DISTINCT e.id_Establecimiento) as total_establecimientos,
                COUNT(DISTINCT rc.CI_Ciudadano) as total_autoridades
             FROM Departamento d
             LEFT JOIN Circuito c ON d.id_Departamento = c.id_Departamento
             LEFT JOIN Establecimiento e ON d.id_Departamento = e.id_Departamento
             LEFT JOIN RolEnCircuito rc ON c.id_Circuito = rc.id_Circuito
             GROUP BY d.id_Departamento
             ORDER BY d.Nombre`
        );
        return rows;
    }

    async findAllCircuits() {
        const [rows] = await pool.query(
            `SELECT c.*, d.Nombre as departamento_nombre
             FROM Circuito c
             JOIN Departamento d ON c.id_Departamento = d.id_Departamento
             ORDER BY d.Nombre, c.Numero`
        );
        return rows;
    }


    async findCircuitById(id_circuito) {
        const [rows] = await pool.query(
            `SELECT c.*, d.Nombre as departamento_nombre
             FROM Circuito c
             JOIN Departamento d ON c.id_Departamento = d.id_Departamento
             WHERE c.id_Circuito = ?`,
            [id_circuito]
        );
        return rows[0] || null;
    }


    async findEstablishmentById(id_establecimiento) {
        const [rows] = await pool.query(
            `SELECT e.*, c.Nombre as circuito_nombre, c.Numero as circuito_numero,
                    d.Nombre as departamento_nombre
             FROM Establecimiento e
             JOIN Circuito c ON e.id_Circuito = c.id_Circuito
             JOIN Departamento d ON e.id_Departamento = d.id_Departamento
             WHERE e.id_Establecimiento = ?`,
            [id_establecimiento]
        );
        return rows[0] || null;
    }

} 