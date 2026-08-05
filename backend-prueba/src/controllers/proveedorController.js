// controllers/supplierController.js

let proveedores = [
  { id: 1, empresa: 'TechSupply S.A.', contacto: 'vistas@techsupply.com', telefono: '+507 6000-0000' },
  { id: 2, empresa: 'Global Logistics', contacto: 'ventas@globallogistics.com', telefono: '+507 6111-1111' }
];

// Listar todos los proveedores
const getProveedores = (req, res) => {
  res.status(200).json({ status: 'success', data: proveedores });
};

// Obtener proveedor por ID
const getProveedorById = (req, res) => {
  const { id } = req.params;
  const proveedor = proveedores.find(p => p.id === parseInt(id));

  if (!proveedor) {
    return res.status(404).json({ message: 'Proveedor no encontrado.' });
  }

  res.status(200).json({ status: 'success', data: proveedor });
};

// Crear nuevo proveedor
const createProveedor = (req, res) => {
  const { empresa, contacto, telefono } = req.body;

  if (!empresa || !contacto || !telefono) {
    return res.status(400).json({ message: 'Todos los campos (empresa, contacto, telefono) son requeridos.' });
  }

  const newProveedor = {
    id: proveedores.length > 0 ? proveedores[proveedores.length - 1].id + 1 : 1,
    empresa,
    contacto,
    telefono
  };

  proveedores.push(newProveedor);
  res.status(201).json({ message: 'Proveedor creado exitosamente.', data: newProveedor });
};

// Actualizar proveedor
const updateProveedor = (req, res) => {
  const { id } = req.params;
  const { empresa, contacto, telefono } = req.body;

  const index = proveedores.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Proveedor no encontrado.' });
  }

  proveedores[index] = {
    ...proveedores[index],
    ...(empresa && { empresa }),
    ...(contacto && { contacto }),
    ...(telefono && { telefono })
  };

  res.status(200).json({ message: 'Proveedor actualizado exitosamente.', data: proveedores[index] });
};

// Eliminar proveedor
const deleteProveedor = (req, res) => {
  const { id } = req.params;
  const index = proveedores.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Proveedor no encontrado.' });
  }

  const deletedProveedor = proveedores.splice(index, 1);
  res.status(200).json({ message: 'Proveedor eliminado exitosamente.', data: deletedProveedor[0] });
};

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};