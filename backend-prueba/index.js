const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Configuración de CORS dinámica
const allowedOrigins = [
  'http://localhost:4200',
  process.env.FRONTEND_URL // Se configurará en Render
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => o && origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Conexión a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado correctamente...'))
  .catch(err => console.error('Error al conectar MongoDB:', err));

// Rutas de la API
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/api/productos', require('./src/routes/producto'));

// Ruta base de verificación
app.get('/', (req, res) => {
  res.send('API CRM Backend ejecutándose en Render');
});

// Puerto dinámico asignado por Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});