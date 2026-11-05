require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const errorHandler = require('./middlewares/error.middleware');

const app = express();

const PORT = process.env.PORT || 8081;

// Configuraciones globales

app.use(cors());

app.use(express.json());

// Ruta principal

app.get('/', (req, res) => {

    res.status(200).json({

        success: true,

        service: 'Auth Service',

        message: 'Auth Service funcionando correctamente',

        version: '1.0.0'

    });

});

// Health check

app.get('/health', (req, res) => {

    res.status(200).json({

        success: true,

        service: 'Auth Service',

        status: 'healthy'

    });

});

// Rutas de autenticación

app.use('/auth', authRoutes);

// Ruta no encontrada

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: 'Ruta no encontrada'

    });

});

// Middleware global de errores

app.use(errorHandler);

// Iniciar servidor

app.listen(PORT, () => {

    console.log('====================================');

    console.log('          AUTH SERVICE');

    console.log('====================================');

    console.log(`Servidor: http://localhost:${PORT}`);

    console.log(`Login: http://localhost:${PORT}/auth/login`);

    console.log('Estado: ONLINE');

    console.log('====================================');

});