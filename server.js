const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3001, () => {
  console.log('Listening on localhost:3001');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('stream', (image) => {
    io.emit('stream', image);
  });
});