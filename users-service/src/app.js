require('dotenv').config();

const express = require('express');
const cors = require('cors');

const prisma = require('./config/database');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

const PORT = process.env.PORT || 8082;

// Middlewares globales

app.use(cors());

app.use(express.json());

// Ruta principal

app.get('/', (req, res) => {

    res.status(200).json({
        success: true,
        service: 'Users Service',
        message: 'Users Service funcionando correctamente',
        version: '1.0.0'
    });

});

// Health check

app.get('/health', async (req, res) => {

    try {

        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            success: true,
            service: 'Users Service',
            database: 'connected',
            status: 'healthy'
        });

    } catch (error) {

        res.status(503).json({
            success: false,
            service: 'Users Service',
            database: 'disconnected',
            status: 'unhealthy'
        });

    }

});

// Rutas de usuarios

app.use('/users', userRoutes);

// Ruta inexistente

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });

});

// Middleware global de errores

app.use(errorHandler);

// Iniciar servidor

const startServer = async () => {

    try {

        await prisma.$connect();

        console.log('PostgreSQL conectado correctamente');

        app.listen(PORT, () => {

            console.log('====================================');
            console.log('       USERS SERVICE API');
            console.log('====================================');
            console.log(`Servidor: http://localhost:${PORT}`);
            console.log(`Usuarios: http://localhost:${PORT}/users`);
            console.log(`Health: http://localhost:${PORT}/health`);
            console.log('Estado: ONLINE');
            console.log('====================================');

        });

    } catch (error) {

        console.error('Error al iniciar Users Service:', error);

        process.exit(1);

    }

};

startServer();