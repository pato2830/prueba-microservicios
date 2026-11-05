# Sistema de Gestión de Usuarios - Arquitectura de Microservicios

## 1. Descripción del proyecto

Aplicación web para la autenticación y administración de usuarios, desarrollada mediante una arquitectura de microservicios independientes.

El sistema está compuesto por tres aplicaciones:

- **Frontend:** interfaz web para iniciar sesión y gestionar usuarios.
- **Auth Service:** servicio encargado de autenticar usuarios y generar tokens JWT.
- **Users Service:** servicio encargado de administrar los usuarios y comunicarse con PostgreSQL.

## 2. Arquitectura

| Componente | Tecnología | Puerto |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | 3000 |
| Auth Service | Node.js + Express + JWT | 8081 |
| Users Service | Node.js + Express + Prisma | 8082 |
| Base de datos | PostgreSQL | 5432 |

### Flujo de autenticación

1. El usuario ingresa sus credenciales desde el frontend.
2. El frontend envía las credenciales al Auth Service.
3. El Auth Service solicita la validación al Users Service mediante HTTP.
4. El Users Service verifica las credenciales utilizando bcrypt y PostgreSQL.
5. Si las credenciales son correctas, el Auth Service genera un token JWT.
6. El frontend utiliza el token para acceder a las operaciones protegidas.

**Importante:** únicamente el Users Service tiene acceso directo a la base de datos.

## 3. Tecnologías utilizadas

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- SweetAlert2

### Backend
- Node.js
- Express
- Axios
- JSON Web Token (JWT)
- bcrypt

### Base de datos
- PostgreSQL
- Prisma ORM

## 4. Estructura del proyecto

```text
prueba-microservicios/
│
├── auth-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── users-service/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## 5. Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js
- npm
- PostgreSQL
- Git

## 6. Configuración e instalación

### 6.1. Base de datos

Crear una base de datos PostgreSQL con el siguiente nombre:

```sql
CREATE DATABASE users_db;
```

### 6.2. Users Service

Ingresar a la carpeta:

```bash
cd users-service
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` tomando como referencia `.env.example` y configurar la conexión a PostgreSQL.

Ejecutar las migraciones:

```bash
npx prisma migrate dev
```

Generar el cliente Prisma si es necesario:

```bash
npx prisma generate
```

Crear el administrador inicial:

```bash
npm run seed:admin
```

Iniciar el servicio:

```bash
npm run dev
```

El servicio estará disponible en:

```text
http://localhost:8082
```

### 6.3. Auth Service

Abrir otra terminal e ingresar a:

```bash
cd auth-service
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` tomando como referencia `.env.example`.

Configurar el mismo `JWT_SECRET` utilizado en Users Service.

Iniciar el servicio:

```bash
npm run dev
```

El servicio estará disponible en:

```text
http://localhost:8081
```

### 6.4. Frontend

Abrir otra terminal e ingresar a:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` tomando como referencia `.env.example`.

Iniciar el frontend:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

## 7. Credenciales iniciales

Para ingresar al sistema:

| Campo | Valor |
|---|---|
| Correo electrónico | admin@prueba.com |
| Contraseña | Admin123 |

Se recomienda cambiar las credenciales después del primer acceso.

## 8. Endpoints disponibles

### Auth Service

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/login` | Autenticación de usuarios |
| GET | `/health` | Estado del servicio |

### Users Service

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/users` | Listar usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear usuario |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |
| POST | `/users/validate` | Validar credenciales para Auth Service |
| GET | `/health` | Estado del servicio |

Las operaciones CRUD requieren un token JWT válido en el encabezado:

```http
Authorization: Bearer <token>
```

## 9. Seguridad implementada

- Contraseñas almacenadas mediante hash bcrypt.
- Contraseñas excluidas de las respuestas de la API.
- Autenticación mediante JWT.
- Protección de las rutas CRUD mediante middleware.
- Validación de credenciales entre microservicios mediante HTTP.
- Variables de entorno para configuraciones sensibles.
- Archivos `.env` excluidos del repositorio mediante `.gitignore`.
- Manejo centralizado de errores.

## 10. Funcionalidades del sistema

- Inicio y cierre de sesión.
- Protección de rutas privadas.
- Listado de usuarios.
- Creación de usuarios.
- Edición de usuarios.
- Eliminación de usuarios.
- Validación de formularios.
- Notificaciones de éxito y error.
- Comunicación independiente entre microservicios.

## 11. Consideraciones

Cada microservicio funciona de manera independiente y utiliza su propio servidor.

El Auth Service no accede directamente a PostgreSQL. La validación de credenciales y las operaciones sobre usuarios son responsabilidad exclusiva del Users Service.

Las claves y configuraciones privadas no deben publicarse en el repositorio.

---

**Proyecto desarrollado como parte de una prueba técnica de arquitectura de microservicios.**