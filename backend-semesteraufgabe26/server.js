const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/users');
const geraeteRoutes = require('./routes/geraete');
const itemRoutes = require('./routes/items');
const User = require('./models/user');
const { seedDatabase } = require('./seed-data');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Anfragen definierene, sodass sie im Sinne der SOP trotzdem erlaubt sind 
app.use('/users', userRoutes);
app.use('/geraete', geraeteRoutes);
app.use('/items', itemRoutes);

mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DATABASE });
const db = mongoose.connection;
db.on('error', err => console.log(err));

db.once('open', async () => {
  console.log('connected to DB');

  //automatisches befuellen der db mit seed-data wenn db leer (keine user)
  //(fuer mich wird db nie leer sein, ist also nur falls projekt geklont wird und mit neuer DB verbunden wird zum ERSTEN befuellen)
  const anzahlUser = await User.countDocuments();
  if (anzahlUser === 0) {
    console.log('Datenbank ist leer — befülle sie automatisch mit Testdaten...');
    await seedDatabase();
  } else {
    console.log('Datenbank enthält bereits Daten — kein automatisches Seeden nötig.');
  }
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ... `);
    }
});