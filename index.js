const express = require('express');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html') })

app.get('/jajarbinks!', (req, res) => { res.send("jarjarbinks!") })

io.on('connection', (socket) => {
    console.log("a user connected!");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg.msg);
        console.log(msg.long);
        console.log(msg.lati);
    });
});

server.listen(3000, () => { console.log("Listening on Port 3000") });