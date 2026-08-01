const express = require('express');
const router = express.Router();
const User = require('./models/user');
const Geraet = require('./models/geraet');
const Item = require('./models/item');
const geraet = require('./models/geraet');

//----------------------------USER-----------------------------------------------

//READ ALL (GET) users (zum testen oeffentlich) - find()
router.get('/users', async (req, res) => {
    const allUsers = await User.find();
    res.send(allUsers);
});
//CREATE (post) neuen user anlegen - save()
router.post('/users', async (req, res) => {
    const newUser = new User({
        username: req.body.username, //die daten im body legen neuen user an
        password: req.body.password
    });
    await newUser.save(); //speichert in atlas
    res.send(newUser); //als response geschickt
});


//---------------------------GERAETE--------------------------------------------

// READ ALL (get) alle geraete von einem user zeigen - find()
router.get('/geraete/user/:userId', async (req, res) => {
    const geraete = await Geraet.find({ userId: req.params.userId });
    res.send(geraete); // wenn noch kein geraet zum user existiert ist das kein fehler und find gibt leeres array zurueck
});

// READ ONE (get) nur ein geraet via id zeigen (falls zugriff auf geraet ueber url passiert)
router.get('/geraete/:id', async (req, res) => {
    const geraet = await Geraet.findOne({ _id: req.params.id });
    if (geraet) {
        res.send(geraet);
    } else {
        res.status(404);
        res.send({ error: "Geraet does not exsit!" });
    }
});

//CREATE (post) ein geraet neu anlegen - save()
router.post('/gerate', async (req, res) => {
    const newGeraet = new Geraet({
        name: req.body.name,
        geraetTyp: req.body.geraetTyp,
        anzahlSchubladen: req.body.anzahlSchubladen,
        userId: req.body.userId
    });
    await newGeraet.save();
    res.send(newGeraet);
});

//UPDATE (patch) daten eins geraets aendern - findOne(), updateOne()
router.patch('/gerate/:id', async (req, res) => {
    try {
        const gerat = await Geraet.findOne({ _id: req.params.id });
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
router.delete('/geraet/:id', async (req, res) => {
    try {
        await Geraet.deleteOne({ _id: req.params.id });
        res.status(204).send(); // 204 = No Content
    } catch {
        res.status(404);
        res.send({ error: "Geraet does not exist!" });
    }
});


//----------------------------ITEMS-------------------------------------------------

//READ ALL (get) alle items von einem Geraet ausgeben - find()
router.get('/items/geraet/:geraetId', async (req, res) => {
    const items = await Item.find({ geraetId: req.params.geraetId });
    res.send(items);
});

//CREATE (post) ein item erzeugen - save()
router.post('/items', async (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        beschreibung: req.body.beschreibung,
        anzahl: req.body.anzahl,
        mhd: req.body.mhd,
        ort: req.body.ort,
        geraetId: req.body.geraetId,
        schubladeIndex: req.body.schubladeIndex,
        userId: req.body.userId
    });
    await newItem.save();
    res.send(newItem);
});

//UPDATE (patch) daten eines items aendern - findOne(), updateOne()
router.patch('/items/:id', async (req, res) => {
    try {
        const item = new Item.findOne({ _id: req.params.id });
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
router.delete('/items/:id', async (req,res) => {
    try{
        await Item.deleteOne({ _id: req.params.id });
        res.status(204).send(); 
    } catch {
        res.status(404);
        res.send({ error: "Item does not exist!" });
    }
});




module.exports = router;