const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const port = process.env.PORT || 3000;

var user = {
    num_user: null,
    status: false
}
var users = [];

app.use("/", express.static(__dirname));
server.listen(port, () => console.log(`Server listening on port ${port}!`));

io.on('connection', (socket) => {
    console.log("Cliente %s conectou", socket.id);
    socket.on('req_player', (data) => {
        socket.emit('res_player', users.length);
    })
    socket.on('player_ok', (data) => {
        data.status = true;
        users.push(data);
        socket.emit('player_ok', users);
        socket.broadcast.emit('player_ok', users);
    })
});



// const express = require("express");
// const app = express();

// app.use("/", express.static(__dirname));

// io.on("connection", socket => {

//   socket.on("notify", id => {
//     socket.broadcast.emit("publish", "Novo jogador: " + id);
//   });

//   socket.on("movement", position => {
//     socket.broadcast.emit("renderPlayer", position);
//   })
// });

// server.listen(port, () => console.log(`Server listening on port ${port}!`));