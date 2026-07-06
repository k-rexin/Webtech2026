const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String
});

module.exports = mongoose.model('User', schema); // Object Relational Mapping ORM, schema fuer user-objekte oder fuer collection users (zb mit .find())