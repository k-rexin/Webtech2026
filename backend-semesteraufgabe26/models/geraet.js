
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  geraetTyp: String,
  anzahlSchubladen: String,
  userId: mongoose.Schema.Types.ObjectId // damit ich weiß zu welchem profil das geraet gehoert
});

module.exports = mongoose.model('Geraet', schema);