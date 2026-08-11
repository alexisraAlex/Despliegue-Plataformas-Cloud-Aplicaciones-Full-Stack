const jwt = require('jsonwebtoken');

// TU FUNCIÓN ORIGINAL (Exactamente igual a como la tienes)
const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token requerido'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token inválido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token no válido'
    });
  }
};

// Funcion para controlar roles (admin, user, guest)
const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Acceso denegado: no tienes permisos suficientes'
      });
    }
    next();
  };
};


module.exports = {
  verificarToken,
  verificarRol
};