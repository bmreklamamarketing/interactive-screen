const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.on("strokeStart", (data) => {
    io.emit("strokeStart", {
      id: socket.id,
      x: data.x,
      y: data.y,
      color: data.color,
      lineWidth: data.lineWidth || 6,
    });
  });

  socket.on("strokeMove", (data) => {
    io.emit("strokeMove", {
      id: socket.id,
      x: data.x,
      y: data.y,
      color: data.color,
      lineWidth: data.lineWidth || 6,
    });
  });

  socket.on("strokeEnd", () => {
    io.emit("strokeEnd", {
      id: socket.id,
    });
  });

  socket.on("clearCanvas", () => {
    io.emit("clearCanvas");
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
    io.emit("strokeEnd", { id: socket.id });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});