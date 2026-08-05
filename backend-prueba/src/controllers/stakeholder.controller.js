const Stakeholder = require("../models/Stakeholder");

exports.crearStakeholder = async (req, res) => {
  try {
    const nuevo = new Stakeholder(req.body);
    await nuevo.save();
    return res.status(201).json({ ok: true, msg: "Creado con éxito", stakeholder: nuevo });
  } catch (error) {
    return res.status(400).json({ ok: false, msg: "Error de validación", error: error.message });
  }
};

exports.obtenerTodos = async (req, res) => {
  try {
    const lista = await Stakeholder.find();
    return res.json({ ok: true, stakeholders: lista });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

exports.actualizarStakeholder = async (req, res) => {
  try {
    const actualizado = await Stakeholder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ ok: false, msg: "No encontrado" });
    return res.json({ ok: true, msg: "Registro actualizado con éxito", stakeholder: actualizado });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};

exports.eliminarStakeholder = async (req, res) => {
  try {
    const eliminado = await Stakeholder.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ ok: false, msg: "No encontrado" });
    return res.json({ ok: true, msg: "Stakeholder eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
};