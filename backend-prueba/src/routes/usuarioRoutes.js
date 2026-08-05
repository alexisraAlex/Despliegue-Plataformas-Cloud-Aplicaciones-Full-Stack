const express = require('express');
const router = express.Router();
const validarJWT = require('../middlewares/validarJWT');
const tieneRol = require('../middlewares/tieneRol');
const {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

// Crear usuario (Registro / Admin)
router.post('/', crearUsuario);

// Endpoints protegidos
router.get('/', validarJWT, obtenerUsuarios);
router.get('/:id', validarJWT, obtenerUsuarioPorId);
router.put('/:id', validarJWT, actualizarUsuario);

// Solo ROL admin puede eliminar
router.delete('/:id', validarJWT, tieneRol('admin'), eliminarUsuario);

module.exports = router;