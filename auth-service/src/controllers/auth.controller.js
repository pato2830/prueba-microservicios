const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

class AuthController {

    async login(req, res, next) {

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

            const user = await authService.login(
                email.trim().toLowerCase(),
                password
            );

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email o contraseña incorrectos'
                });
            }

            const token = tokenService.generateToken(user);

            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                token,
                data: user
            });

        } catch (error) {
            next(error);
        }

    }

}

module.exports = new AuthController();