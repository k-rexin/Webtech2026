//hier wird ein modul erzeugt das für anwendung verfuegbar sein muss
const express = require('express')
const router = express.Router()
const User = require('./models/users') // großgeschrieben weil es als objekt verwendet wird und im url klein und im plural

// get all users
router.get('/users', async (req, res) => {
    const allUsers = await User.find();
    console.log(allUsers);
    res.send(allUserss);
});

// post one user
router.post('/users', async (req, res) => {
    const username = req.body.username;
    const email = req.body.username;
    let user = await User.findOne({ username: username }) // sucht nach user 
    console.log('user nach username : ', user)

    let user = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (user) {
        res.status(400)
        res.send({ message: " username and/or email already exists" }) //mit response wird methode verlassen
    }
    else {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role // man kann das passwort verschluesseln mit decrypt package(?)
        })
        await newUser.save();
        res.status(201);
        res.send(newUser);
    }
}
);

// get one user via username
router.get('/:name', async (req, res) => {
    const user = await User.findOne({ username: req.params.name });
    if (user) {
        res.status(200)
        res.send(user)
    }
    else {
        res.status(404);
        res.send({
            error: "User does not exist!"
        });
    }
})

// delete one user via id
router.delete('/:id', async (req, res) => { //delete one gibt immer was zurueck

    const result = await User.deleteOne({ _id: req.params.id })
    if (result.deletedCount == 1) { // wenn schon was geloescht wurde dann gehts mit erfolg raus aus methode
        res.status(204)
        res.send()
    }
    else {
        res.status(404)
        res.send({ error: "User does not exist!" })
    }
});

module.exports = router; // macht modul verfuegbar