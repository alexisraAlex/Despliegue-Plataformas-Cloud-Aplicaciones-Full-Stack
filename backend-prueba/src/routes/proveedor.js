// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
} = require('../controllers/supplierController');

// Aplicar el middleware verifyToken a todas las rutas de proveedores
router.use(verifyToken);

router.get('/', getProveedores);
router.get('/:id', getProveedorById);
router.post('/', createProveedor);
router.put('/:id', updateProveedor);
router.delete('/:id', deleteProveedor);

module.exports = router;