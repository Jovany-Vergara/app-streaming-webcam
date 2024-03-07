const socket = io.connect(window.location.origin);
const webcam = document.querySelector('#webcam');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const stream = document.querySelector('#stream');
let streamInterval;

// Crear un canvas y obtener su contexto
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

function startWebcamStream() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        webcam.srcObject = stream;
        webcam.onloadedmetadata = (e) => {
          webcam.play();
        };
      })
      .catch((error) => {
        console.error("Error accessing webcam: ", error);
      });
  }

  webcam.addEventListener('play', () => {
    // Asegurar que el tamaño del canvas coincide con el tamaño del video
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