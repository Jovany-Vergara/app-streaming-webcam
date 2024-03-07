// Importa el módulo express, que proporciona utilidades para construir servidores web
const express = require('express');
// Crea una nueva aplicación express
const app = express();
// Crea un nuevo servidor HTTP que delega las solicitudes a la aplicación express
const server = require('http').Server(app);
// Crea un nuevo servidor Socket.IO que se adjunta al servidor HTTP
const io = require('socket.io')(server);

// Sirve archivos estáticos (como HTML, CSS y JS) desde el directorio actual
app.use(express.static(__dirname));

// Define una ruta para la raíz del sitio web ("/") que envía el archivo index.html al cliente
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Inicia el servidor en el puerto 3001 y registra un mensaje en la consola cuando el servidor ha iniciado
server.listen(3001, () => {
  console.log('Listening on localhost:3001');
});

// Registra un manejador de eventos que se activa cuando un cliente se conecta al servidor Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // Registra un manejador de eventos que se activa cuando el cliente emite un evento 'stream'
  // Este evento asume que el cliente envía una imagen, que luego se emite a todos los clientes conectados
  socket.on('stream', (image) => {
    io.emit('stream', image);
  });
});