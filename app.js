const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  
  socket.on('listarPlatos', async () => {
    try {
      const platos = await obtenerPlatos();
      socket.emit('platosListados', platos);
    } catch (error) {
      socket.emit('errorListarPlatos', 'Error al obtener platos');
    }
  });

  
});


async function obtenerPlatos() {
  try {
    const response = await axios.get('https://api-dishes.vercel.app/');
    return response.data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}


server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
