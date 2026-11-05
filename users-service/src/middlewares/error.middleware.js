const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', {
        message: err.message,
        path: req.originalUrl,
        method: req.method
    });

    let statusCode = err.statusCode || 500;
    let message = err.message;

    // Errores de Prisma
    if (err.code === 'P2002') {
        statusCode = 409;
        message = 'El registro ya existe. Verifica los datos proporcionados.';
    }

    if (err.code === 'P2025') {
        statusCode = 404;
        message = 'El registro solicitado no existe.';
    }

    if (err.code === 'P2003') {
        statusCode = 409;
        message = 'No se puede completar la operación por una restricción de integridad.';
    }

    // Respuesta segura
    res.status(statusCode).json({
        success: false,
        message: statusCode >= 500
            ? 'Error interno del servidor'
            : message
    });
};

module.exports = errorHandler;