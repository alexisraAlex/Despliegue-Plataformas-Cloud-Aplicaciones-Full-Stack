const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ==================== DEFINICIÓN DE ESQUEMAS Y MODELOS ====================
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'user'], default: 'user' },
  estado: { type: Boolean, default: true }
}, { timestamps: true });

const ClienteSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String },
  telefono: { type: String },
  empresa: { type: String }
}, { timestamps: true });

const ProductoSchema = new Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

const VentaSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  productos: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],
  total: { type: Number, default: 0 }
}, { timestamps: true });

const ActividadSchema = new Schema({
  tipo: { type: String },
  descripcion: { type: String },
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
  responsable: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

const TicketSchema = new Schema({
  problema: { type: String },
  estado: { type: String, default: 'Abierto' },
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' }
}, { timestamps: true });

const NotificacionSchema = new Schema({
  mensaje: { type: String, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  fecha: { type: Date, default: Date.now }
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema);
const Producto = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);
const Venta = mongoose.models.Venta || mongoose.model('Venta', VentaSchema);
const Actividad = mongoose.models.Actividad || mongoose.model('Actividad', ActividadSchema);
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
const Notificacion = mongoose.models.Notificacion || mongoose.model('Notificacion', NotificacionSchema);

// ==================== MIDDLEWARES DE AUTENTICACIÓN Y ROLES ====================
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.usuario = verificado;
    next();
  } catch (error) {
    return res.status(403).json({ ok: false, mensaje: 'Token inválido o expirado.' });
  }
};

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ ok: false, mensaje: 'No tienes permisos para realizar esta acción.' });
    }
    next();
  };
};

// ==================== CONEXIÓN BASE DE DATOS ====================
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Conectado');
    await crearAdminInicial();
  })
  .catch(err => console.error('Error conectando a MongoDB:', err));

async function crearAdminInicial() {
  try {
    const adminExistente = await Usuario.findOne({ email: 'admin@crm.com' });
    if (!adminExistente) {
      const passwordHashed = await bcrypt.hash('Admin123*', 10);
      await Usuario.create({
        nombre: 'Administrador Principal',
        email: 'admin@crm.com',
        password: passwordHashed,
        rol: 'admin',
        estado: true
      });
      console.log('Usuario Admin por defecto creado: admin@crm.com / Admin123*');
    }
  } catch (error) {
    console.error('Error al inicializar Admin:', error);
  }
}

// ==================== RUTAS PÚBLICAS ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    res.json({
      ok: true,
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error interno en el servidor', error });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'El correo ya existe.' });
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHashed,
      rol: rol || 'user'
    });
    res.status(201).json({ ok: true, usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario', error });
  }
});

// ==================== RUTAS PROTEGIDAS ====================
app.use('/api', verificarToken);

// 1. USUARIOS
app.get('/api/users', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener usuarios' });
  }
});

app.post('/api/users', verificarRol(['admin']), async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: 'Error al crear usuario', error });
  }
});

app.delete('/api/users/:id', verificarRol(['admin']), async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ ok: true, mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: 'Error al eliminar usuario' });
  }
});

// 2. CLIENTES
app.get('/api/clientes', async (req, res) => res.json(await Cliente.find()));
app.post('/api/clientes', verificarRol(['user', 'admin']), async (req, res) => res.status(201).json(await Cliente.create(req.body)));
app.put('/api/clientes/:id', verificarRol(['user', 'admin']), async (req, res) => res.json(await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/clientes/:id', verificarRol(['admin']), async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.json({ ok: true, mensaje: 'Cliente eliminado' });
});

// 3. PRODUCTOS
app.get('/api/productos', async (req, res) => res.json(await Producto.find()));
app.post('/api/productos', verificarRol(['user', 'admin']), async (req, res) => res.status(201).json(await Producto.create(req.body)));

// 4. VENTAS
app.get('/api/ventas', async (req, res) => res.json(await Venta.find().populate('cliente usuario productos')));
app.post('/api/ventas', verificarRol(['user', 'admin']), async (req, res) => {
  try {
    const nuevaVenta = await Venta.create(req.body);
    await Notificacion.create({
      mensaje: `Nueva venta registrada por $${nuevaVenta.total || 0}`,
      usuario: req.usuario.id
    });
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: 'Error al registrar la venta', error });
  }
});

// 5. ACTIVIDADES
app.get('/api/actividades', async (req, res) => res.json(await Actividad.find().populate('responsable cliente')));
app.post('/api/actividades', verificarRol(['user', 'admin']), async (req, res) => res.status(201).json(await Actividad.create(req.body)));

// 6. TICKETS
app.get('/api/tickets', async (req, res) => res.json(await Ticket.find().populate('cliente')));
app.post('/api/tickets', verificarRol(['user', 'admin']), async (req, res) => res.status(201).json(await Ticket.create(req.body)));

// 7. NOTIFICACIONES
app.get('/api/notificaciones', async (req, res) => res.json(await Notificacion.find().sort({ fecha: -1 })));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`));