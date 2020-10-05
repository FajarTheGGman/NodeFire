// Dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const body = require('body-parser')
const firebase = require('firebase')
const fs = require("fs")
const parser = require("body-parser")


// Firebase Setup
const firebase_init = firebase.initializeApp({
  // Your Firebase Key
})

// firestore variables
var firestore = firebase_init.firestore();
var dbs = "crud"

require('dotenv').config();
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
app.use(cors());
app.use(parser.json())
app.use(parser.urlencoded({ extended : true }))

// Assets
app.get('/assets/bootstrap', (req,res) => {
  fs.createReadStream(__dirname + '/assets/bootstrap.min.css').pipe(res)
})

app.get('/assets/fire', (req,res) => {
    fs.createReadStream(__dirname + '/assets/fire.png').pipe(res)
})


app.get('/assets/node', (req,res) => {
    fs.createReadStream(__dirname + '/assets/node.png').pipe(res)
})


// Front-End
app.get("/", (req,res) => {
    fs.createReadStream(__dirname + '/view/index.html').pipe(res)
})

app.get("/create", (req,res) => {
  fs.createReadStream(__dirname + '/view/create.html').pipe(res)
})

app.get("/ganti", (req,res) => {
  fs.createReadStream(__dirname + '/view/update.html').pipe(res)
})


// Server
app.get('/data', (req, res) => {
    var isi = []
    firestore.collection(dbs).get().then(a => {
        a.forEach((result) => {
            isi.push(result.data())
        })
        res.send(isi)
    }).catch(err => {
        res.send({error: "Error Connection To Database"})
    })
})

app.get('/id', (req, res) => {
    var isi = []
    firestore.collection(dbs).get().then(a => {
        a.forEach((result) => {
            isi.push(result.id)
        })
        res.send(isi)
    }).catch(err => {
        res.send({error: "Error Connection To Database"})
    })
})

// Create new database
app.post('/send', (req,res) => {
    firestore.collection(dbs).doc(req.body.doc).set({
        name: req.body.name,
        place: req.body.place,
        github: req.body.github
    })

    res.send({
        name: req.query.name,
        place: req.query.place,
        github: req.query.github,
        status: "Data Successfully Send To Server"
    })
})

// Delete Database
app.post('/hapus', (req,res) => {
    firestore.collection(dbs).doc(req.body.doc).delete().catch(err => {
        res.send({ error: "Data gagal di hapus" })
    })
    res.send({ success: "data berhasil di hapus" })
})

// Update Database
app.post('/update', (req,res) => {
	firestore.collection(dbs).doc(req.body.doc).update({
		name: req.body.name,
		place: req.body.place,
		github: req.body.github
	}).catch(err => {
		res.send({ error: "gagal update database bro" })
	})
	res.send({ success: "sukses update data bro" })
})

// Search Database
app.post('/search', (req,res) => {
    firestore.collection(dbs).doc(req.body.doc).get().then(d => {
		res.send(d.data())
    })
})

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
