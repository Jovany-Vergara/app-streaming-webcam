//Esta línea establece una conexión con el servidor Socket.IO en el mismo origen (URL) que la página web.
const socket = io.connect(window.location.origin);
//Esta línea selecciona el elemento de video con el ID 'webcam' en la página HTML.
const webcam = document.querySelector('#webcam');
//Esta línea selecciona los botones de inicio y parada en la página HTML.
const startButton = document.querySelector('#start');
//Esta línea selecciona el botón de detener con el ID 'stop' en la página HTML.
const stopButton = document.querySelector('#stop');
//Esta línea selecciona el elemento de video con el ID 'stream' en la página HTML.
const stream = document.querySelector('#stream');
//Esta línea declara una variable para almacenar el intervalo de tiempo que se usará para emitir imágenes de la webcam.
let streamInterval;

// Crear un canvas y obtener su contexto
const canvas = document.createElement('canvas');
// Obtener el contexto del canvas
const context = canvas.getContext('2d');

// Esta función inicia la emisión de la webcam.
function startWebcamStream() {
  // Comprobar si el navegador es compatible con la API de getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //Esta línea solicita acceso a la cámara web del usuario. El objeto { video: true } indica que queremos un stream de video.
    navigator.mediaDevices.getUserMedia({ video: true })
    //Si el usuario concede el acceso a la cámara web, el navegador devuelve una promesa que se resuelve con un objeto MediaStream
      .then((stream) => {
        //sta línea establece el stream de la cámara web como la fuente del elemento de video en la página web.
        webcam.srcObject = stream;
        //Esta línea agrega un manejador de eventos que comienza a reproducir el video cuando los metadatos del video (como la duración y las dimensiones del video) se han cargado.
        webcam.onloadedmetadata = (e) => {
          webcam.play();
        };
      })
      //Si el usuario no concede el acceso a la cámara web, el navegador devuelve una promesa que se rechaza con un error.
      .catch((error) => {
        console.error("Error accessing webcam: ", error);
      });
  }

  // Cuando el video comienza a reproducirse, ejecutar el siguiente código
  webcam.addEventListener('play', () => {
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;

    streamInterval = setInterval(() => {
      // Dibujar el video en el canvas
      context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
      // Emitir la imagen del canvas
      socket.emit('stream', canvas.toDataURL('image/webp'));
    }, 500);
  });
}

// Esta función detiene la emisión de la webcam.
function stopWebcamStream() {
  // Detener la emisión de la webcam
  clearInterval(streamInterval);
  const stream = webcam.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  webcam.srcObject = null;
}

startButton.addEventListener('click', startWebcamStream);
stopButton.addEventListener('click', stopWebcamStream);

socket.on('stream', (image) => {
  stream.src = image;
});