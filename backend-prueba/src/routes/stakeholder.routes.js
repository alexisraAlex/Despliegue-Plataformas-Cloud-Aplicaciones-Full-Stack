const express = require('express');
const router = express.Router();
const stakeholderController = require('../controllers/stakeholder.controller');

// 1. Middleware de autenticación
const verificarToken = require('../middleware/auth');

// 2. Definición de rutas protegidas
router.post('/', verificarToken, stakeholderController.crearStakeholder);
router.get('/', verificarToken, stakeholderController.obtenerTodos);
router.put('/:id', verificarToken, stakeholderController.actualizarStakeholder);
router.delete('/:id', verificarToken, stakeholderController.eliminarStakeholder);

module.exports = router;