// models/item.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  beschreibung: String,
  anzahl: String,
  mhd: String,
  ort: String,
  geraetId: mongoose.Schema.Types.ObjectId, // zu welchem geraet gehoert das item
  schubladeIndex: Number, // leer wenn truhe
  reihenfolge: Number,
  userId: mongoose.Schema.Types.ObjectId // zu welchem profil gehoert das item
});

module.exports = mongoose.model('Item', schema);