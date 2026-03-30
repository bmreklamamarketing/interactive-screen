const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Раздаём файлы (html, js)
app.use(express.static(__dirname));

// Подключения
io.on("connection", (socket) => {
  console.log("client connected");

  // При движении — отправляем всем остальным
  socket.on("move", (data) => {
    socket.broadcast.emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

// 🔥 ВАЖНО: порт для Render
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});