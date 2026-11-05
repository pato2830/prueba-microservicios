require('dotenv').config();

const prisma = require('../config/database');
const bcrypt = require('bcrypt');

async function createAdmin() {

    try {

        const email = 'admin@prueba.com';

        const existingAdmin = await prisma.user.findUnique({
            where: { email }
        });

        if (existingAdmin) {

            console.log('El administrador ya existe.');
            return;

        }

        const hashedPassword = await bcrypt.hash(
            'Admin123',
            12
        );

        const admin = await prisma.user.create({
            data: {
                name: 'Administrador',
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

        console.log('Administrador creado correctamente.');
        console.log(admin);

    } catch (error) {

        console.error('Error creando administrador:', error);

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }

}

createAdmin();