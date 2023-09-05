const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const { Server } = require("socket.io");
require('dotenv').config()
const { rd } = require("./redis.js")


app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}))
app.use(express.static(path.join(__dirname, "..", "client", "build"))); 
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
    
const server = http.createServer(app);
const io = new Server(server)

io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);

    // Clients will periodically update and send their coordinates via geo event.
    // Redis will update, then get the nearest users to be set to the socket's nearestSockets
    socket.on('geo', async(res) => {
        socket.longitude = res.longitude;
        socket.latitude = res.latitude;
        try {
            const user = await rd.InsertUser(socket.id, res.longitude, res.latitude);
            // Distance Control TBD
            // nearest contains the socket's own id.
            const nearest = await rd.GetNearestUsers(socket.id, 10)
            socket.nearestSockets = nearest;
            //console.log(`Nearest Sockets to ${socket.id} are: ${socket.nearestSockets}`);
            socket.emit('geo', socket.nearestSockets);
        } catch (err) {
            console.error(err);
        }
    })

    // Emits messages to all nearestSockets that was set in geo.
    socket.on('message', async(msg) => {
        //NearestSockets contains self so you don't need to do socket.emit here.
        console.log(`${socket.id} says ${msg.msg}.`);
        socket.to(socket.nearestSockets).emit('message', msg.msg);
        socket.emit('message', msg.msg);
    });

    // Removes users from redis geoHash so they won't show up on another search.
    socket.on('disconnect', async() => {
        try {
            await rd.RemoveUser(socket.id);
            console.log('User Disconnected ' + socket.id);
        } catch (err) {
            console.error(err);
        }
    });
})

server.listen(3001, async() => {
    console.log("Listening on Port 3001")
});