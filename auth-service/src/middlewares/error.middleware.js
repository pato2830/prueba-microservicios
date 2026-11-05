const errorHandler = (err, req, res, next) => {

    console.error('[AUTH ERROR]', err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({

        success: false,

        message: statusCode === 503
            ? err.message
            : 'Error interno del servidor'

    });

};

module.exports = errorHandler;