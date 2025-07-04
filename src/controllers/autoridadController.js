import { autoridadRepository } from '../repositories/index.js';

export class AutoridadController {
    
    static async validarAutoridad(req, res) {
        try {
            const { credencial_civica } = req.body;

            if (!credencial_civica) {
                return res.status(400).json({ 
                    error: 'El parámetro "credencial_civica" es requerido.' 
                });
            }

            const autoridad = await autoridadRepository.validatePresidenteMesa(credencial_civica);

            if (autoridad) {
                res.status(200).json({ 
                    message: 'Validación exitosa. El usuario es Presidente de Mesa.',
                    autoridad
                });
            } else {
                res.status(403).json({ 
                    error: 'Credencial inválida o no corresponde a un Presidente de Mesa.' 
                });
            }
        } catch (error) {
            res.status(500).json({ 
                error: 'Error interno del servidor', 
                details: error.message 
            });
        }
    }

} 