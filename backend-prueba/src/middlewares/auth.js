const express = require('express');
const router = express.Router();

// Importar desestructurando con el nombre correcto: verificarToken
const { verificarToken } = require('../middlewares/auth');

const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productoController');

// Aplicar el middleware
router.use(verificarToken);

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;