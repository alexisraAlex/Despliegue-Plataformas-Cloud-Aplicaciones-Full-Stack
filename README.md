# CRM Full Stack - Sistema de Gestión de Relaciones con Clientes

Un sistema CRM (Customer Relationship Management) web completo diseñado para gestionar clientes, ventas, productos, actividades, tickets de soporte y notificaciones en una plataforma centralizada. Desarrollado con una arquitectura desacoplada utilizando **Node.js/Express** para la API Backend y **Angular** para la interfaz de usuario.

---

## 🚀 Despliegue en Producción

* **Frontend App (Angular):** [https://crm-frontend-aovu.onrender.com](https://crm-frontend-aovu.onrender.com)
* **Backend API (Node.js/Express):** [https://crm-backend-api-16yf.onrender.com](https://crm-backend-api-16yf.onrender.com)

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Node.js & Express:** Entorno de ejecución y framework HTTP para la API REST.
* **MongoDB & Mongoose:** Base de datos NoSQL y ODM para el modelado de datos.
* **JSON Web Tokens (JWT):** Autenticación y autorización basada en tokens.
* **Bcrypt.js:** Encriptación y hashing seguro de contraseñas.
* **CORS & Dotenv:** Configuración de origen cruzado y gestión de variables de entorno.

### Frontend
* **Angular:** Framework para aplicaciones web de página única (SPA).
* **RxJS & HttpClient:** Manejo de peticiones asíncronas e interacción con la API.
* **TypeScript:** Lenguaje principal para la estructura del cliente frontend.

---

## 🔒 Autenticación y Control de Acceso (RBAC)

El sistema cuenta con un middleware de autenticación por Token JWT y control de acceso basado en roles (`admin` y `user`):

* **Públicas:** Rutas de registro (`/api/auth/register`) e inicio de sesión (`/api/auth/login`).
* **Protegidas (User / Admin):** Consulta y creación de Clientes, Productos, Ventas, Actividades y Tickets.
* **Administrador:** Gestión de usuarios y eliminación de registros restringida exclusivamente al rol `admin`.

---

## 📌 Documentación de Endpoints (API REST)

### Autenticación (Pública)
* `POST /api/auth/register` - Registro de nuevos usuarios.
* `POST /api/auth/login` - Inicio de sesión y generación de token JWT.

### Usuarios (Requiere Bearer Token)
* `GET /api/users` - Obtener lista de usuarios registrados.
* `POST /api/users` - Crear usuario (Solo Admin).
* `DELETE /api/users/:id` - Eliminar usuario por ID (Solo Admin).

### Módulos del CRM (Requieren Bearer Token)
* `GET | POST | PUT | DELETE /api/clientes` - Gestión de Clientes.
* `GET | POST /api/productos` - Gestión de Catálogo de Productos.
* `GET | POST /api/ventas` - Registro y consulta de Ventas.
* `GET | POST /api/actividades` - Registro de Interacciones y Tareas.
* `GET | POST /api/tickets` - Gestión de Soporte y Reclamaciones.
* `GET /api/notificaciones` - Historial de Notificaciones del Sistema.

---

## 💻 Instalación y Ejecución Local

### Prerequisitos
* Node.js (v18 o superior)
* npm o yarn
* Instancia de MongoDB (Local o MongoDB Atlas)

### 1. Clonar e Instalar Backend
```bash
git clone <URL-DEL-REPOSOTORIO-BACKEND>
cd backend-prueba
npm install
