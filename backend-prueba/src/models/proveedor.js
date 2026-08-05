const mongoose = require('mongoose');

const ProveedorSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Esto genera el createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);