const express = require('express');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { db } = require("./dbo.js")


app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html') })


io.on('connection', (socket) => {

    socket.on('LongLat', async(obj) => {
        socket.longitude = obj.longitude;
        socket.latitude = obj.latitude;

        console.log("Socket ID is" + socket.id);
        console.log("Longitude is " + socket.longitude);
        console.log("Latitude is " + socket.latitude);
        const user = await db.InsertOrUpdate(socket);
        //const nearest = await db.Find(user);
        //nearest.forEach()
    })

    socket.on('chat message', async(msg) => {
        io.emit('chat message', msg.msg);
        console.log(msg.msg);
        console.log(msg.timestamp);
        console.log(socket.id);
        //await db.InsertMessage(socket, msg.msg, msg.timestamp)
    });


    socket.on('disconnect', async() => {
        await db.Remove(socket)
        console.log('user disconnected');
    });
})

server.listen(3000, async() => {
    await db.connect();
    //await db.ShowAll();
    console.log("Listening on Port 3000")
});