const http = require('http');
const { Server } = require("socket.io")
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const { db } = require("./dbo.js")
const { rd } = require("./redis.js")


io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);

    socket.on('geo', async(res) => {
        socket.longitude = res.longitude;
        socket.latitude = res.latitude;
        try {
            const user = await rd.InsertUser(socket.id, res.longitude, res.latitude);
            //Distance Control TBD
            const nearest = await rd.GetNearestUsers(socket.id, 10)
            socket.nearestSockets = nearest;
            //console.log(`Nearest Sockets to ${socket.id} are: ${socket.nearestSockets}`);
            socket.emit('geo', socket.nearestSockets);
        } catch (err) {
            console.error(err);
        }
    })

    socket.on('message', async(msg) => {
        //NearestSockets contains self so you don't need to do socket.emit here.
        console.log(`${socket.id} says ${msg.msg}.`);
        socket.to(socket.nearestSockets).emit('message', msg.msg);
        socket.emit('message', msg.msg);
    });


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
    await db.connect();
    console.log("Listening on Port 3001")
});