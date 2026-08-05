const jwt = require('jsonwebtoken');

// ACCESS TOKEN (corto)
const generarAccessToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id || usuario.id,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// REFRESH TOKEN (largo)
const generarRefreshToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id || usuario.id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  generarAccessToken,
  generarRefreshToken
};