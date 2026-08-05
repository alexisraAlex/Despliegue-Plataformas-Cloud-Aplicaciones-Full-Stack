// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productController');

// Aplicar el middleware verifyToken a todas las rutas de productos
router.use(verifyToken);

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;