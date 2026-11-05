const userService = require('../services/user.service');

class UserController {

    // GET /users
    async getAll(req, res, next) {

        try {

            const users = await userService.getAll();

            res.status(200).json({
                success: true,
                data: users
            });

        } catch (error) {
            next(error);
        }

    }

    // GET /users/:id
    async getById(req, res, next) {

        try {

            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
            }

            const user = await userService.getById(id);

            res.status(200).json({
                success: true,
                data: user
            });

        } catch (error) {
            next(error);
        }

    }

    // POST /users
    async create(req, res, next) {

        try {

            const { name, email, password } = req.body;

            if (
                typeof name !== 'string' ||
                typeof email !== 'string' ||
                typeof password !== 'string' ||
                !name.trim() ||
                !email.trim() ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y contraseña son obligatorios'
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 8 caracteres'
                });
            }

            const user = await userService.create({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: user
            });

        } catch (error) {
            next(error);
        }

    }

    // PUT /users/:id
    async update(req, res, next) {

        try {

            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
            }

            const { name, email, password } = req.body;

            if (
                (name !== undefined && (typeof name !== 'string' || !name.trim())) ||
                (email !== undefined && (typeof email !== 'string' || !email.trim())) ||
                (password !== undefined && (typeof password !== 'string' || password.length < 8))
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Los datos proporcionados no son válidos'
                });
            }

            const data = {
                ...(name !== undefined && { name: name.trim() }),
                ...(email !== undefined && { email: email.trim().toLowerCase() }),
                ...(password !== undefined && { password })
            };

            if (Object.keys(data).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Debes proporcionar al menos un campo para actualizar'
                });
            }

            const user = await userService.update(id, data);

            res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: user
            });

        } catch (error) {
            next(error);
        }

    }

    // DELETE /users/:id
    async delete(req, res, next) {

        try {

            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
            }

            const result = await userService.delete(id);

            res.status(200).json({
                success: true,
                ...result
            });

        } catch (error) {
            next(error);
        }

    }

    // POST /users/validate
    async validate(req, res, next) {

        try {

            const { email, password } = req.body;

            if (
                typeof email !== 'string' ||
                typeof password !== 'string' ||
                !email.trim() ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son obligatorios'
                });
            }

            const user = await userService.validateCredentials(
                email.trim().toLowerCase(),
                password
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    valid: false,
                    message: 'Credenciales incorrectas'
                });
            }

            res.status(200).json({
                success: true,
                valid: true,
                data: user
            });

        } catch (error) {
            next(error);
        }

    }

}

module.exports = new UserController();