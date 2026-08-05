const mongoose = require("mongoose");

const StakeholderSchema = new mongoose.Schema({
  type: { type: String, required: true },
  nombre: { type: String, required: true },
  identificacion: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Stakeholder", StakeholderSchema);  