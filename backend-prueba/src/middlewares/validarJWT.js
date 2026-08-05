const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token requerido'
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guarda el payload decoded ({ id, rol }) en la petición
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token invalido o expirado'
    });
  }
};

module.exports = validarJWT;