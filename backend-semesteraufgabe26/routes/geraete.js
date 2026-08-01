const express = require('express');
const router = express.Router();
const Geraet = require('../models/geraet');
const { getUserIdFromToken } = require('../utils/auth');

// READ ALL (get) alle geraete von einem eingeloggten user zeigen - find()
router.get('/', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    const geraete = await Geraet.find({ userId: userId });
    res.send(geraete); // wenn noch kein geraet zum user existiert ist das kein fehler und find gibt leeres array zurueck
});

// READ ONE (get) nur ein geraet via id zeigen (falls zugriff auf geraet ueber url passiert)
router.get('/:id', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    const geraet = await Geraet.findOne({ _id: req.params.id, userId: userId });
    if (geraet) {
        res.send(geraet);
    } else {
        res.status(404);
        res.send({ error: "Geraet does not exsit!" });
    }
});

//CREATE (post) ein geraet neu anlegen - save()
router.post('/', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    const newGeraet = new Geraet({
        name: req.body.name,
        geraetTyp: req.body.geraetTyp,
        anzahlSchubladen: req.body.anzahlSchubladen,
        userId: userId
    });
    await newGeraet.save();
    res.send(newGeraet);
});

//UPDATE (patch) daten eins geraets aendern - findOne(), updateOne()
router.patch('/:id', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    try {
        const gerat = await Geraet.findOne({ _id: req.params.id, userId: userId });
        if (!geraet) {
            res.status(404);
            res.send({ error: 'Geraet does not exist!' });
            return;
        } //ab hier klar das geraet existiert UND eingeloggtem user gehoert

        if (req.body.name) geraet.name = req.body.name; //sucht was im body mitgeschickt
        if (req.body.geraetTyp) geraet.geraetTyp = req.body.geraetTyp;
        if (req.body.anzahlSchubladen) geraet.anzahlSchubladen = req.body.anzahlSchubladen;

        await Geraet.updateOne({ _id: req.params.id }, geraet); //aendert das was mitgeschickt wurde
        res.send(geraet);
    } catch {
        res.status(404);
        res.send({ error: "Geraet does not exist!" });
    }
});

//DELETE ein geraet löschen - deleteOne()
router.delete('/:id', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) {  // nur eingeloggter User
        res.status(401);
        res.send({ message: 'Not authorized' });
        return;
    }

    try {
        await Geraet.deleteOne({ _id: req.params.id, userId: userId });
        res.status(204).send(); // 204 = No Content
    } catch {
        res.status(404);
        res.send({ error: "Geraet does not exist!" });
    }
});

module.exports = router;