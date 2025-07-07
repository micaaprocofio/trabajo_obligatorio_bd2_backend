import express from 'express';
import ciudadanoRoutes from './ciudadanoRoutes.js';
import autoridadRoutes from './autoridadRoutes.js';
import votacionRoutes from './votacionRoutes.js';
import departamentoRoutes from './departamentoRoutes.js';
import politicoRoutes from './politicoRoutes.js';

const router = express.Router();

router.use('/ciudadanos', ciudadanoRoutes);
router.use('/autoridades', autoridadRoutes);
router.use('/votacion', votacionRoutes);
router.use('/geografia', departamentoRoutes);
router.use('/politicos', politicoRoutes);


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
            votacion: '/api/votacion',
            geografia: '/api/geografia',
            politicos: '/api/politicos'
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