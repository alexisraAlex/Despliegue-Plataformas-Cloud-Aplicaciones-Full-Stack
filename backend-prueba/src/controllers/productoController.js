// Banco de datos temporal en memoria (sustituir por modelo/base de datos según aplique)
let productos = [
  { id: 1, nombre: 'Laptop HP', precio: 850.00, stock: 15 },
  { id: 2, nombre: 'Monitor Dell 27"', precio: 220.00, stock: 30 }
];

// Listar todos los productos
const getProductos = (req, res) => {
  res.status(200).json({ status: 'success', data: productos });
};

// Obtener un producto por ID
const getProductoById = (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id === parseInt(id));

  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }

  res.status(200).json({ status: 'success', data: producto });
};

// Crear un nuevo producto
const createProducto = (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ message: 'Todos los campos (nombre, precio, stock) son requeridos.' });
  }

  const newProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio: parseFloat(precio),
    stock: parseInt(stock)
  };

  productos.push(newProducto);
  res.status(201).json({ message: 'Producto creado exitosamente.', data: newProducto });
};

// Actualizar un producto
const updateProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;

  const index = productos.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }

  productos[index] = {
    ...productos[index],
    ...(nombre && { nombre }),
    ...(precio != null && { precio: parseFloat(precio) }),
    ...(stock != null && { stock: parseInt(stock) })
  };

  res.status(200).json({ message: 'Producto actualizado exitosamente.', data: productos[index] });
};

// Eliminar un producto
const deleteProducto = (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }

  const deletedProducto = productos.splice(index, 1);
  res.status(200).json({ message: 'Producto eliminado exitosamente.', data: deletedProducto[0] });
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};