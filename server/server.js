const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

// instantiate a new server on this node server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on('send_message', (data => {
    socket.to(data.room).emit('receive_message', data)
  }))

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
