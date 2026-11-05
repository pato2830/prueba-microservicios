const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

class AuthService {

    async login(email, password) {

        try {

            const response = await axios.post(
                `${USER_SERVICE_URL}/users/validate`,
                {
                    email,
                    password
                },
                {
                    timeout: 5000
                }
            );

            if (!response.data.valid) {
                return null;
            }

            return response.data.data;

        } catch (error) {

            if (error.response?.status === 401) {
                return null;
            }

            if (
                error.code === 'ECONNREFUSED' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'ECONNABORTED' ||
                !error.response
            ) {

                const serviceError = new Error(
                    'El servicio de usuarios no está disponible'
                );

                serviceError.statusCode = 503;

                throw serviceError;

            }

            throw error;

        }

    }

}

module.exports = new AuthService();