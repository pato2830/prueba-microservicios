const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en el archivo .env');
}

class TokenService {

    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN,
                issuer: 'auth-service',
                audience: 'microservices-app'
            }
        );
    }

}

module.exports = new TokenService();