const express = require('express');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = 'GeolocationalChat'
const client = new MongoClient(url);

let db;
let userCollection;
let messages;



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
            message: msg.msg,
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
    db = client.db('GeolocationalChat')
    userCollection = db.collection('userCollection')
    messages = db.collection('messages')

    console.log("Listening on Port 3000")
});