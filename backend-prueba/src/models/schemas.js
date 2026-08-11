const mongoose = require('mongoose');

// 1. Usuarios
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
  estado: { type: Boolean, default: true }
}, { timestamps: true });

// 2. Clientes
const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  empresa: String,
  telefono: String,
  correo: String
}, { timestamps: true });

// 3. Productos
const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: String
}, { timestamps: true });

// 4. Ventas
const VentaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }],
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: true }
}, { timestamps: true });

// 5. Actividades
const ActividadSchema = new mongoose.Schema({
  tipo: { type: String, required: true }, // Llamada, Reunión, Correo
  descripcion: String,
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }
}, { timestamps: true });

// 6. Tickets de Soporte
const TicketSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  problema: { type: String, required: true },
  estado: { type: String, enum: ['Abierto', 'En Proceso', 'Cerrado'], default: 'Abierto' }
}, { timestamps: true });

// 7. Notificaciones
const NotificacionSchema = new mongoose.Schema({
  mensaje: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  Usuario: mongoose.model('Usuario', UsuarioSchema),
  Cliente: mongoose.model('Cliente', ClienteSchema),
  Producto: mongoose.model('Producto', ProductoSchema),
  Venta: mongoose.model('Venta', VentaSchema),
  Actividad: mongoose.model('Actividad', ActividadSchema),
  Ticket: mongoose.model('Ticket', TicketSchema),
  Notificacion: mongoose.model('Notificacion', NotificacionSchema)
};