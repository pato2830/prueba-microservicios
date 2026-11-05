const prisma = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

class UserService {

    // Obtener todos los usuarios
    async getAll() {

        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

    }

    // Obtener usuario por ID
    async getById(id) {

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }

        return user;

    }

    // Crear usuario
    async create(data) {

        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            const error = new Error('El email ya está registrado');
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            SALT_ROUNDS
        );

        return await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

    }

    // Actualizar usuario
    async update(id, data) {

        await this.getById(id);

        const updateData = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.email !== undefined) {
            updateData.email = data.email;
        }

        if (data.password) {
            updateData.password = await bcrypt.hash(
                data.password,
                SALT_ROUNDS
            );
        }

        try {

            return await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            });

        } catch (error) {

            if (error.code === 'P2002') {
                error.statusCode = 409;
                error.message = 'El email ya está registrado';
            }

            throw error;

        }

    }

    // Eliminar usuario
    async delete(id) {

        await this.getById(id);

        await prisma.user.delete({
            where: { id }
        });

        return {
            message: 'Usuario eliminado correctamente'
        };

    }

    // Validar credenciales
    async validateCredentials(email, password) {

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };

    }

}

module.exports = new UserService();