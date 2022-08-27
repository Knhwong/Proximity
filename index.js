const express = require('express');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { db } = require("./dbo.js")


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
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(3000, async() => {
    await db.connect();
    await db.ShowAll();
    console.log("Listening on Port 3000")
});