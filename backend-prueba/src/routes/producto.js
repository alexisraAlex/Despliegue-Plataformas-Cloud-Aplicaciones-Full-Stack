const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middlewares/auth');

const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productoController');

// Middleware para proteger las rutas
router.use(verificarToken);

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;