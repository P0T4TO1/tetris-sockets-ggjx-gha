const socket = io();
const btnLogout = document.getElementById('btnLogout');

const username = document.cookie.split('username=')[1].split(';')[0];
const roomName = document.cookie.split('roomName=')[1].split(';')[0];

btnLogout.addEventListener('click', () => {
  socket.emit('disconnectPlayer', { username, roomName });
  document.location.href = '/logout';
});
