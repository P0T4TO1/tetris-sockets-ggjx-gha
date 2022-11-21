module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Un jugador se ha conectado! " + socket.id);

    socket.on("joinRoom", (data) => {
      socket.join(data.roomName);
      let usersReady = 0;
      let usersLength = io.sockets.adapter.rooms.get(data.roomName).size;
      socket.on("sendReady", () => {
        usersReady++;
        console.log(usersReady);
        console.log(usersLength);
        if (usersReady === usersLength) {
          io.to(data.roomName).emit("reloadAll");
        }
      });
      // console.log(usersReady);
      // if (usersReady === 2) {
      //   io.to(data.roomName).emit("reloadAll");
      // }
      if (usersLength === 2) {
        io.to(data.roomName).emit("startGame", null);
      } else if (usersLength > 2) {
        io.to(socket.id).emit("fullRoom", null);
      }
      io.to(data.roomName).emit("messageConnected", {
        user: `${data.username}`,
        text: `${data.username} se ha unido a la sala ${data.roomName}!`,
      });
    });

    socket.on("gameOverAll", (data) => {
      io.to(data.roomName).emit("endGame", data);
    });

    socket.on("sendGrid", (grid) => {
      socket.broadcast.emit("gridPlayer2", grid);
    });

    socket.on("sendScore", (score) => {
      socket.broadcast.emit("scorePlayer2", score);
    });

    socket.on("sendMiniGrid", (minigrid) => {
      socket.broadcast.emit("miniGridPlayer2", minigrid);
    });

    socket.on("sendReloadAll", () => {
      socket.broadcast.emit("reloadAll");
    });

    socket.on("disconnect", () => {
      console.log("Un jugador se ha desconectado! " + socket.id);
    });
  });
};
