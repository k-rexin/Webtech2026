//hier wird ein modul erzeugt das für anwendung verfuegbar sein muss
const express = require('express')
const router = express.Router()
const User = require('./models/users') // großgeschrieben weil es als objekt verwendet wird

router.get('/users', (req, res) => {
    res.status(200)
    res.send({ message: "Uebung8"})
})

module.exports = router; // macht modul verfuegbar