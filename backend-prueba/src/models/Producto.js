const mongoose = require('mongoose');

// Definimos la estructura de nuestro objeto en la base de datos
const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        default: 0
    },
    fechaCreacion: {
        type: Date,
        default: Date.now()
    }
});

// Exportamos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Producto', ProductoSchema);