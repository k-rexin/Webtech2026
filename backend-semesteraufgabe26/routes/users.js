const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//CREATE (post) neuen user anlegen - findOne(), hash(), save()
router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const check = await User.findOne({ username: username });
    if (check) {
        res.status(401); // 401 = Unautorisiert
        res.send({ message: `Username ${username} already exists` });
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username: username, password: hashPassword });
    await newUser.save();

    res.status(201); //201 = erfolgreich bearbeitet
    res.send({ id: newUser._id, username: newUser.username }); // bei mongoose-objekten kann man auf _id so zugreifen sieht aber komsisch aus 
});// nur hier wird nicht komplettes mongoose-objekt von _id zurueckgegeben sondern umbenannt in id  


//CREATE (post) erstellt Token fuer den Login - findOne(), compare()
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: username });
    if (!user) {
        res.status(401);
        res.send({ message: 'username/password wrong' });
        return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(401);
        res.send({ message: 'username/password wrong' }); // bei beiden die selbe nachricht aus sicherheitsgruenden
        return;
    }

    const userWithoutPassword = { id: user._id, username: user.username }; // Payload des JWT
    const token = jwt.sign(userWithoutPassword, username); // username als secret fuer Signatur

    res.status(200);
    res.send({ token: token, user: userWithoutPassword });
});



//--------------------------------------NUR FUER ADMIN----------------------------
//passwort zuruecksetzen falls es vergessen wurde, nur ueber thunder Client benutzbar ( ohne Token nur mit username, neuesPasswort )
router.post('/reset-password', async (req, res) => {
  const username = req.body.username;
  const newPassword = req.body.newPassword;

  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(404);
    res.send({ message: 'User nicht gefunden' });
    return;
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  res.status(200);
  res.send({ message: 'Passwort erfolgreich zurückgesetzt' });
});

module.exports = router;