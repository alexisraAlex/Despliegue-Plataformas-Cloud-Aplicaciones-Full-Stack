const tieneRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Se quiere verificar el rol sin validar el token primero'
      });
    }

    const rolUsuario = req.usuario.rol ? req.usuario.rol.toLowerCase() : '';
    const rolesNormalizados = rolesPermitidos.map((r) => r.toLowerCase());

    if (!rolesNormalizados.includes(rolUsuario)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tiene permisos para esta accion'
      });
    }

    next();
  };
};

module.exports = tieneRol;