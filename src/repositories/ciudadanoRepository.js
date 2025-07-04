import { pool } from '../config/database.js';

export class CiudadanoRepository {

    async findByCredencial(credencial) {
        const [rows] = await pool.query(
            'SELECT * FROM Ciudadano WHERE CredencialCivica = ?', 
            [credencial]
        );
        return rows[0] || null;
    }

    async findByCI(CI) {
        const [rows] = await pool.query(
            'SELECT * FROM Ciudadano WHERE CI = ?', 
            [CI]
        );
        return rows[0] || null;
    }


    async createVoteRegistration(CI_Ciudadano, id_eleccion, CredencialCivica, VotoObservado = false) {
        const [result] = await pool.query(
            'INSERT INTO RegistroVoto (CI_Ciudadano, id_eleccion, CredencialCivica, VotoObservado) VALUES (?, ?, ?, ?)',
            [CI_Ciudadano, id_eleccion, CredencialCivica, VotoObservado]
        );
        return result.insertId;
    }

    async existsVoteRegistration(CI_Ciudadano, id_eleccion) {
        const [rows] = await pool.query(
            'SELECT * FROM RegistroVoto WHERE CI_Ciudadano = ? AND id_eleccion = ?',
            [CI_Ciudadano, id_eleccion]
        );
        return rows.length > 0;
    }

} 