const express = require('express');
const { appendFile } = require('fs/promises');
const http = require('http');
const { Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { db } = require("./dbo.js")

app.get('/', (req, res) => { res.sendFile(__dirname + '/public/index.html') })
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);
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
        socket.longitude = res.long;
        socket.latitude = res.lat;
        const user = await db.InsertOrUpdate(socket);
        const nearest = await db.FindNearest(user, 100);


        /*
        If we use Joining to Rooms, we will need to backtrack to leave Rooms if we get out of range
        Hence why just setting the entire array of nearestSockets is alot more hassle free.
        */

        socket.nearestSockets = nearest.map((user) => { return user.id })
        console.log(`Nearest Sockets to ${socket.id} are: ${socket.nearestSockets}`);

        // Communicate closest sockets
        socket.emit('connectGeo', socket.nearestSockets);
    })

    socket.on('chat message', async(msg) => {

        //NearestSockets contains self so you don't need to do socket.emit here.
        socket.to(socket.nearestSockets).emit('chat message', msg.msg);
        //await db.InsertMessage(socket, msg.msg, msg.timestamp)
    });


    socket.on('disconnect', async() => {
        await db.Remove(socket)
        console.log('User Disconnected ' + socket.id);
    });
})

server.listen(3000, async() => {
    await db.connect();
    await db.ShowAll();
    //Clear Cache
    await db.Remove({})
    console.log("Listening on Port 3000")
});