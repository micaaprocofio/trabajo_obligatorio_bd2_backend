import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await testConnection();
        
        app.listen(port, () => {
            console.log(`Servidor del Sistema de Votación corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error al inicializar el servidor:', error);
        process.exit(1);
    }
};


startServer(); 