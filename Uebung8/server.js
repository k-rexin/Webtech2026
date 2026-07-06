const express = require('express'); // express- anwendung die mit node verwaltet wird
const mongoose = require('mongoose');
const routes = require('./routes');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json()) // contenttyp in request und response 
app.use('/api', routes)

//connect to db
mongoose.connect(process.env.DB_CONNECTION_ATLAS, { dbName: process.env.DATABASE }) 
const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error)
})
db.once('open', () => { //steht alles im skript
    console.log('connected to DB')
})

app.listen(PORT, (error) => { // lauscht die ganze zeit ob request reinkommen
    if(error) {
        console.log(error)
    } else{
        console.log('server startet und lauscht am port ${PORT}')
    }
})  


