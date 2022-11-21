module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer);

  // let usersReady = 0;
  io.on("connection", (socket) => {
    console.log("Un jugador se ha conectado! " + socket.id);

    socket.on("joinRoom", (data) => {
      socket.join(data.roomName);
      let usersLength = io.sockets.adapter.rooms.get(data.roomName).size;
      // get 2 ready status from the room and start the game
      // socket.on("sendReady", (data) => {
      //   usersReady++;
      // });
      // if (usersReady === 2) {
      //   io.to(data.roomName).emit("startGame");
      // }
      if (usersLength === 2) {
        io.to(data.roomName).emit("startGame", null);
      } else if (usersLength > 2) {
        socket.emit("roomFull");
      }
      io.to(data.roomName).emit("messageConnected", {
        user: `${data.username}`,
        text: `${data.username} se ha unido a la sala ${data.roomName}!`,
      });
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

    socket.on("sendMessageWin", () => {
      socket.broadcast.emit("messageWin");
    });

    socket.on("disconnect", () => {
      console.log("Un jugador se ha desconectado!");
    });
  });
};
