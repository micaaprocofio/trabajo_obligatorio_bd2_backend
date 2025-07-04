import express from 'express';
import ciudadanoRoutes from './ciudadanoRoutes.js';
import autoridadRoutes from './autoridadRoutes.js';
import departamentoRoutes from './departamentoRoutes.js';

const router = express.Router();

router.use('/ciudadanos', ciudadanoRoutes);
router.use('/autoridades', autoridadRoutes);
router.use('/geografia', departamentoRoutes);

router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sistema de votación funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

router.get('/info', (req, res) => {
    res.json({
        name: 'Sistema de Votación Uruguayo',
        version: '2.0.0',
        description: 'API REST para sistema electoral uruguayo',
        endpoints: {
            ciudadanos: '/api/ciudadanos',
            autoridades: '/api/autoridades',
            geografia: '/api/geografia',
        },
        database_compatibility: {
            version: '2.0.0',
            nuevas_tablas: [
                'Departamento',
                'Circuito', 
                'Establecimiento',
                'Politico',
                'Lista_PartidoPolitico',
                'ListaSinCandidato',
                'ListasCandidatos',
                'RolEnCircuito'
            ],
            cambios_principales: [
                'Ciudadano usa CI y CredencialCivica',
                'RegistroVoto incluye VotoObservado',
                'Voto sin campo observado',
                'RolEnEstablecimiento -> RolEnCircuito'
            ]
        }
    });
});

export default router; 