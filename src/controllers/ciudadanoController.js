import { ciudadanoRepository } from '../repositories/index.js';

export class CiudadanoController {
    static async buscarPorCredencial(req, res) {
        try {
            const { credencial } = req.query;
            
            if (!credencial) {
                return res.status(400).json({ 
                    error: 'El parámetro "credencial" es requerido.' 
                });
            }

            const ciudadano = await ciudadanoRepository.findByCredencial(credencial);
            
            if (ciudadano) {
                res.json(ciudadano);
            } else {
                res.status(404).json({ 
                    error: 'Ciudadano no encontrado.' 
                });
            }
        } catch (error) {
            res.status(500).json({ 
                error: 'Error interno del servidor', 
                details: error.message 
            });
        }
    }

    static async registrarVotante(req, res) {
        try {
            // console.log("Recibiendo solicitud para registrar votante");
            const { id_ciudadano, id_eleccion, credencial_civica, voto_observado} = req.body;
            // console.log(req.body); 

            if (!id_ciudadano || !id_eleccion) {
                return res.status(400).json({ 
                    error: 'id_ciudadano e id_eleccion son requeridos.' 
                });
            }

            const existeRegistro = await ciudadanoRepository.existsVoteRegistration(id_ciudadano, id_eleccion);
            
            if (existeRegistro) {
                return res.status(409).json({ 
                    error: 'Este ciudadano ya ha sido registrado para esta elección.' 
                });
            }

            const id_registro = await ciudadanoRepository.createVoteRegistration(id_ciudadano, id_eleccion, credencial_civica, voto_observado);
            
            res.status(201).json({ 
                message: 'Votante registrado exitosamente.',
                id_registro,
                voto_observado
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Error interno del servidor', 
                details: error.message 
            });
        }
    }
}

export const buscarCiudadanoPorCredencialCivica = async (req, res) => {
    try {
        const { credencial_civica } = req.query;
        
        if (!credencial_civica) {
            return res.status(400).json({ error: 'El parámetro "credencial_civica" es requerido.' });
        }

        const ciudadano = await ciudadanoRepository.findByCredencial(credencial_civica);
        
        if (ciudadano) {
            res.json(ciudadano);
        } else {
            res.status(404).json({ error: 'Ciudadano no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

export const obtenerTodosCiudadanos = async (req, res) => {
    try {
        const ciudadanos = await ciudadanoRepository.findAll();
        res.json(ciudadanos);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

export const obtenerCiudadanoPorCI = async (req, res) => {
    try {
        const { CI } = req.params;
        
        if (!CI) {
            return res.status(400).json({ error: 'El parámetro "CI" es requerido.' });
        }

        const ciudadano = await ciudadanoRepository.findByCI(CI);
        
        if (ciudadano) {
            res.json(ciudadano);
        } else {
            res.status(404).json({ error: 'Ciudadano no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
}; 