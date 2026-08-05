const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// CREAR USUARIO / REGISTRO
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El correo ya esta registrado'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordEncriptado = bcrypt.hashSync(password, salt);

    const usuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptado,
      rol: rol || 'user'
    });

    await usuario.save();

    res.status(201).json({
      ok: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
        createdAt: usuario.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al crear usuario'
    });
  }
};

// OBTENER TODOS LOS USUARIOS
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-password');
    
    // Mapeo para enviar id de forma amigable al frontend
    const usuariosFormateados = usuarios.map((user) => ({
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo,
      createdAt: user.createdAt
    }));

    res.json(usuariosFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener usuarios'
    });
  }
};

// OBTENER USUARIO POR ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id, '-password');

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      ok: true,
      usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener usuario'
    });
  }
};

// ACTUALIZAR USUARIO
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...resto } = req.body;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      resto.password = bcrypt.hashSync(password, salt);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto, {
      new: true,
      select: '-password'
    });

    if (!usuarioActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      ok: true,
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar usuario'
    });
  }
};

// ELIMINAR USUARIO
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      ok: true,
      mensaje: 'Usuario eliminado'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar usuario'
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};