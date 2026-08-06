const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('ERROR CRÍTICO: No se ha definido la variable MONGO_URI en las variables de entorno.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conexión exitosa a MongoDB Atlas'))
    .catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
}

// Rutas de la API
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/api/productos', require('./src/routes/producto'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});