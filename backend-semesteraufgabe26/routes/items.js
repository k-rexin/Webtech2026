const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const { getUserIdFromToken } = require('../utils/auth');

//READ ALL (get) alle items von einem Geraet ausgeben - find()
router.get('/geraet/:geraetId', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    const items = await Item.find({ geraetId: req.params.geraetId, userId: userId })
    .sort({ reihenfolge: 1 }); //aufsteigend nach reihenfolge
    res.send(items);
});

//CREATE (post) ein item erzeugen - save()
router.post('/', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }
    //zaehlt, wie viele Items schon in dieser Position (Schublade + Ort) liegen
    const count = await Item.countDocuments({
        geraetId: req.body.geraetId,
        schubladeIndex: req.body.schubladeIndex,
        ort: req.body.ort,
        userId: userId
    });

    const newItem = new Item({
        name: req.body.name,
        beschreibung: req.body.beschreibung,
        anzahl: req.body.anzahl,
        mhd: req.body.mhd,
        ort: req.body.ort,
        geraetId: req.body.geraetId,
        schubladeIndex: req.body.schubladeIndex,
        reihenfolge: count,
        userId: userId
    });
    await newItem.save();
    res.send(newItem);
});

//UPDATE (patch) daten reihenfolge aktualisieren (fuer drag&drop auch innerhalb einer spalte)
router.patch('/reorder', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401);
    res.send({ message: 'Not authorized' });
    return;
  }

  const updates = req.body.updates; // Array von { id, ort, schubladeIndex, reihenfolge }

  try {
    for (const update of updates) {
      await Item.updateOne(
        { _id: update.id, userId: userId },
        { ort: update.ort, schubladeIndex: update.schubladeIndex, reihenfolge: update.reihenfolge }
      );
    }
    res.status(200);
    res.send({ message: 'Reihenfolge aktualisiert' });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ error: 'Fehler beim Aktualisieren der Reihenfolge' });
  }
});

//UPDATE (patch) daten eines items aendern - findOne(), updateOne()
router.patch('/:id', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    try {
        const item = new Item.findOne({ _id: req.params.id, userId: userId });
        if (!item) {
            res.status(404);
            res.send({ error: 'Item does not exist!' });
            return;
        } // ab hier klar das item existiert und zu user gehoert
        if (req.body.name) item.name = req.body.name;
        if (req.body.beschreibung) item.beschreibung = req.body.beschreibung;
        if (req.body.anzahl) item.anzahl = req.body.anzahl;
        if (req.body.mhd) item.mhd = req.body.mhd;
        if (req.body.ort) item.ort = req.body.ort;

        await Item.updateOne({ _id: req.params.id }, item);
        res.send(item);
    } catch {
        res.status(404);
        res.send({ error: "Item does not exist!" });
    }
});

// DELETE ein Item löschen -  deleteOne()
router.delete('/:id', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    try {
        await Item.deleteOne({ _id: req.params.id, userId: userId });
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({ error: "Item does not exist!" });
    }
});

module.exports = router;