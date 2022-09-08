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


io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);

    socket.on('geo', async(res) => {
        socket.longitude = res.longitude;
        socket.latitude = res.latitude;
        const user = await db.InsertOrUpdate(socket);
        const nearest = await db.FindNearest(user, 100);


        /*
        If we use Joining to Rooms, we will need to backtrack to leave Rooms if we get out of range
        Hence why just setting the entire array of nearestSockets is alot more hassle free.
        */

        socket.nearestSockets = nearest.map((user) => { return user.id })
        console.log(`Nearest Sockets to ${socket.id} are: ${socket.nearestSockets}`);
        socket.emit('geo', socket.nearestSockets);
    })

    socket.on('message', async(msg) => {

        //NearestSockets contains self so you don't need to do socket.emit here.
        console.log(`${socket.id} says ${msg.msg}.`);
        socket.to(socket.nearestSockets).emit('message', msg.msg);
        socket.emit('message', msg.msg);
        //io.emit('message', msg.msg);
        //await db.InsertMessage(socket, msg.msg, msg.timestamp)
    });


    socket.on('disconnect', async() => {
        await db.Remove(socket)
        console.log('User Disconnected ' + socket.id);
    });
})

server.listen(3001, async() => {
    await db.connect();
    await db.ShowAll();
    //Clear Cache
    await db.Remove({})
    console.log("Listening on Port 3001")
});