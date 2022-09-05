const express = require('express');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { db } = require("./dbo.js")

app.get('/', (req, res) => { res.sendFile(__dirname + '/public/index.html') })
app.use(express.static(__dirname + '/public'));

var connections = []
io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);
    connections.push(socket.id);

    socket.on('LongLat', async(obj) => {
        //socket.longitude = obj.longitude;
        //socket.latitude = obj.latitude;
        //console.log(`LongLat: ${socket.longitude} ${socket.latitude}`);
        //console.log("Socket ID is" + socket.id);
        //console.log("Longitude is " + socket.longitude);
        //console.log("Latitude is " + socket.latitude);
        //const user = await db.InsertOrUpdate(socket);
        /*
        const nearest = await db.FindNearest(user);

        socket.nearest = nearest;
        socket.nearestSockets = nearest.forEach((user) => { return user.id })
        socket.nearestSockets.push(socket.id);
        */
    })

    socket.on('connectGeo', async(res) => {
        console.log("Socket ID is " + socket.id);
        console.log("Longitude is " + res.long);
        console.log("Latitude is " + res.lat);
        socket.longitude = res.long;
        socket.latitude = res.lat;
        console.log('// FINDING NEAREST // \n');
        const user = await db.InsertOrUpdate(socket);
        const nearest = await db.FindNearest(user, 100);
        socket.nearest = nearest;
        socket.nearestSockets = nearest.map((user) => { return user.id })
        console.log(socket.nearestSockets);
        socket.emit('connectGeo', socket.nearest);
    })

    socket.on('chat message', async(msg) => {
        console.log("Emitting Chat Message to");
        console.log(socket.nearestSockets);
        io.to(socket.nearestSockets).emit('chat message', msg.msg);
        //socket.emit('chat message', msg.msg);
        //io.emit('chat message', msg.msg);
        //await db.InsertMessage(socket, msg.msg, msg.timestamp)
    });


    socket.on('disconnect', async() => {
        //connections.pop(socket.id)
        await db.Remove(socket)
        console.log('Socket Disconnected ' + socket.id);
    });
})

server.listen(3000, async() => {
    await db.connect();
    await db.ShowAll();
    console.log("Listening on Port 3000")
});