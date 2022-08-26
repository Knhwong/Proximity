const express = require('express');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { dbo } = require('./db.js')
const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = 'GeolocationalChat'
const client = new MongoClient(url);

var db;
var userCollection;
var messages;



app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html') })


io.on('connection', (socket) => {
    console.log("a user connected!");


    socket.on('LongLat', (obj) => {
        console.log("Longitude is " + obj.longitude);
        console.log("Latitude is " + obj.latitude);

    })

    socket.on('chat message', async(msg) => {
        io.emit('chat message', msg.msg);
        console.log(msg.msg);

        const err = await messages.insertOne({
            uid: socket.id,
            message: msg,
        })
        console.log("Inserted Message =>", err);

    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(3000, async() => {
    await client.connect();
    console.log("Connected to Database")
    const db = client.db('GeolocationalChat')
        //userCollection = db.collection('userCollection')

    console.log("Listening on Port 3000")
});