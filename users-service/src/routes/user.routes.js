const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Validación interna de credenciales para Auth Service.
// Se mantiene fuera del middleware JWT para permitir el login.
router.post('/validate', (req, res, next) =>
    userController.validate(req, res, next)
);

// Desde aquí, todas las rutas requieren JWT.
router.use(authMiddleware);

// CRUD protegido
router.get('/', (req, res, next) =>
    userController.getAll(req, res, next)
);

router.get('/:id', (req, res, next) =>
    userController.getById(req, res, next)
);

router.post('/', (req, res, next) =>
    userController.create(req, res, next)
);

router.put('/:id', (req, res, next) =>
    userController.update(req, res, next)
);

router.delete('/:id', (req, res, next) =>
    userController.delete(req, res, next)
);

module.exports = router;