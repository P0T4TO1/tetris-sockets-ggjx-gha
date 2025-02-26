module.exports = (httpServer) => {
  const { Server } = require('socket.io');
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('Un jugador se ha conectado! ' + socket.id);

    socket.on('joinRoom', (data) => {
      socket.join(data.roomName);
      let usersReady = 0;
      let usersLength = io.sockets.adapter.rooms.get(data.roomName).size;
      socket.on('sendReady', () => {
        usersReady++;
        if (usersReady === usersLength) {
          io.to(data.roomName).emit('reloadAll');
        }
      });
      if (usersLength === 2) {
        io.to(data.roomName).emit('startGame', null);
      } else if (usersLength > 2) {
        io.to(socket.id).emit('fullRoom', null);
      }
      io.to(data.roomName).emit('messageConnected', {
        user: `${data.username}`,
        text: `${data.username} se ha unido a la sala ${data.roomName}!`,
      });
    });

    socket.on('gameOverAll', (data) => {
      socket.broadcast.emit('gameWinner', data);
    });

    socket.on('sendGrid', (grid) => {
      socket.broadcast.emit('gridPlayer2', grid);
    });

    socket.on('sendScore', (score) => {
      socket.broadcast.emit('scorePlayer2', score);
    });

    socket.on('sendMiniGrid', (minigrid) => {
      socket.broadcast.emit('miniGridPlayer2', minigrid);
    });

    socket.on('sendReloadAll', () => {
      socket.broadcast.emit('reloadAll');
    });

    socket.on('disconnectPlayer', (data) => {
      socket.leave(data.roomName);
      io.to(data.roomName).emit('playerDisconnected', {
        user: `${data.username}`,
        text: `${data.username} se ha desconectado de la sala ${data.roomName}!`,
      });
    });

    socket.on('disconnect', () => {
      console.log('Un jugador se ha desconectado! ' + socket.id);
    });
  });
};
