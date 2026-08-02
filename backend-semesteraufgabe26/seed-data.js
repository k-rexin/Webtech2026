//daten die beim starten der DB automatisch in die db geladen werden (falls db leer)

const bcrypt = require('bcrypt');
const User = require('./models/user');
const Geraet = require('./models/geraet');
const Item = require('./models/item');

const positionen = ['links', 'mitte', 'rechts'];

const tkLebensmittel = [
  { name: 'Erbsen', beschreibung: 'TK-Gemüse, ideal als Beilage' },
  { name: 'Pommes Frites', beschreibung: 'Für den nächsten Grillabend' },
  { name: 'Vanilleeis (vegan)', beschreibung: 'Auf Hafermilch-Basis, 1 Liter' },
  { name: 'Pizza Margherita', beschreibung: 'Steinofen-Art, vegetarisch' },
  { name: 'Vegane Schnitzel', beschreibung: 'Auf Soja-Basis, paniert' },
  { name: 'Beerenmischung', beschreibung: 'Himbeeren, Blaubeeren, Johannisbeeren' },
  { name: 'Falafel', beschreibung: 'Kichererbsen-Bällchen, vorfrittiert' },
  { name: 'Rahmspinat', beschreibung: 'Portionsblöcke, mit Sojasahne' },
  { name: 'Baguette', beschreibung: 'Vorgebacken, nur noch aufbacken' },
  { name: 'Croissants (vegan)', beschreibung: 'Ohne Butter, pflanzlich' },
  { name: 'Gemüsepfanne', beschreibung: 'Asiatische Mischung mit Paprika und Brokkoli' },
  { name: 'Veggie-Bratlinge', beschreibung: 'Aus Linsen und Gemüse' },
  { name: 'Kartoffelecken', beschreibung: 'Rosmarin-gewürzt' },
  { name: 'Waffeln (vegan)', beschreibung: 'Zum Toaster aufbacken' },
  { name: 'Bratkartoffeln', beschreibung: 'Fertig gewürfelt' }
];

async function erzeugeItems(geraetId, schubladeIndex, userId, anzahl) {
  const zaehlerProPosition = { links: 0, mitte: 0, rechts: 0 };

  for (let i = 0; i < anzahl; i++) {
    const position = positionen[i % 3];
    const reihenfolge = zaehlerProPosition[position];
    zaehlerProPosition[position]++;

    const produkt = tkLebensmittel[i % tkLebensmittel.length];

    await new Item({
      name: produkt.name,
      beschreibung: produkt.beschreibung,
      anzahl: String((i % 5) + 1),
      mhd: '2026-12-31',
      ort: position,
      geraetId: geraetId,
      schubladeIndex: schubladeIndex,
      reihenfolge: reihenfolge,
      userId: userId
    }).save();
  }
}
async function seedDatabase() {

// ==================== KASSANDRA ====================
  const hash1 = await bcrypt.hash('test1234', 10);
  const kassandra = new User({ username: 'kassandra', password: hash1 });
  await kassandra.save();

  const schrankKassandra = new Geraet({
    name: 'TK-Schrank Küche', geraetTyp: 'schrank', anzahlSchubladen: '2', userId: kassandra._id
  });
  await schrankKassandra.save();
  await erzeugeItems(schrankKassandra._id, 0, kassandra._id, 10);
  await erzeugeItems(schrankKassandra._id, 1, kassandra._id, 10);

  // ==================== KATRIN ====================
  const hash2 = await bcrypt.hash('test1234', 10);
  const katrin = new User({ username: 'katrin', password: hash2 });
  await katrin.save();

  const schrankKatrin = new Geraet({
    name: 'Küche', geraetTyp: 'schrank', anzahlSchubladen: '3', userId: katrin._id
  });
  await schrankKatrin.save();
  await erzeugeItems(schrankKatrin._id, 0, katrin._id, 10);
  await erzeugeItems(schrankKatrin._id, 1, katrin._id, 10);
  await erzeugeItems(schrankKatrin._id, 2, katrin._id, 10);

  const truheKatrin = new Geraet({
    name: 'Kellertruhe', geraetTyp: 'truhe', anzahlSchubladen: '0', userId: katrin._id
  });
  await truheKatrin.save();
  await erzeugeItems(truheKatrin._id, null, katrin._id, 40);

  // ==================== GAST ====================
    const hash3 = await bcrypt.hash('test1234', 10);
    const user3 = new User({ username: 'gast', password: hash3 });
    await user3.save();
    // Gast bewusst ohne Geräte/Items — testet den "leerer Zustand" Fall

  console.log('Seed erfolgreich abgeschlossen! User: kassandra, katrin, gast (Passwort: test1234)');
}

module.exports = { seedDatabase };