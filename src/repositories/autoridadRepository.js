import { pool } from '../config/database.js';

export class AutoridadRepository {

    async validatePresidenteMesa(credencial_civica) {
        const [rows] = await pool.query(
            `SELECT c.CI, c.NombreCompleto, c.CredencialCivica, r.id_Circuito, 
                    circ.Nombre as circuito_nombre, circ.Numero as circuito_numero,
                    d.Nombre as departamento_nombre
             FROM RolEnCircuito r
             JOIN Ciudadano c ON r.CI_Ciudadano = c.CI
             JOIN Circuito circ ON r.id_Circuito = circ.id_Circuito
             JOIN Departamento d ON circ.id_Departamento = d.id_Departamento
             WHERE c.CredencialCivica = ? AND r.Rol = 'Presidente'`,
            [credencial_civica]
        );
        return rows[0] || null;
    }

} 