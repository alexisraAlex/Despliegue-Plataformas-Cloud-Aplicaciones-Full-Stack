const Usuario = require('../models/Usuario');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generarAccessToken, generarRefreshToken } = require('../utils/generarTokens');

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Usuario no existe'
      });
    }

    // 2. Validar password
    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Password incorrecto'
      });
    }

    // 3. Generar tokens
    const accessToken = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    // 4. Guardar refresh token en DB
    await RefreshToken.create({
      usuario: usuario._id,
      token: refreshToken
    });

    // 5. Respuesta
    res.json({
      ok: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error en el servidor durante el login'
    });
  }
};

// RENOVAR ACCESS TOKEN
const renovarToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Refresh token requerido'
    });
  }

  try {
    // 1. Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2. Buscar usuario correspondiente para incluir el rol actualizado
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // 3. Generar nuevo Access Token
    const nuevoAccessToken = generarAccessToken(usuario);

    res.json({
      ok: true,
      accessToken: nuevoAccessToken
    });
  } catch (error) {
    return res.status(403).json({
      ok: false,
      mensaje: 'Refresh token invalido o expirado'
    });
  }
};

module.exports = {
  login,
  renovarToken
};