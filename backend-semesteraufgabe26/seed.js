//HILFSMITTEL NUR zum manuellen loeschen und wieder befuellen der daten in der db

const mongoose = require('mongoose');
require('dotenv').config();
const { seedDatabase } = require('./seed-data');
const User = require('./models/user');
const Geraet = require('./models/geraet');
const Item = require('./models/item');

async function run() {
  await mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DATABASE });
  console.log('Verbunden mit der Datenbank...');

  await User.deleteMany({});
  await Geraet.deleteMany({});
  await Item.deleteMany({});
  console.log('Alte Daten gelöscht.');

  await seedDatabase();

  await mongoose.disconnect();
}

run().catch(err => {
  console.log('Fehler beim Seeden:', err);
  mongoose.disconnect();
});