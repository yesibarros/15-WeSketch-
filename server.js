const express = require("express");
const socketio = require("socket.io");

const app = express(); // the app returned by express() is a JavaScript Function. Not something we can pass to our sockets!
const path = require("path");

app.use(express.static(path.join(__dirname, "browser")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// app.listen() returns an http.Server object
// http://expressjs.com/en/4x/api.html#app.listen
const server = app.listen(1337, function () {
  console.log("The server is listening on port 1337!");
});

/** Socket Io! */
const io = socketio(server);
const strokes = [];

io.on("connection", function (socket) {
  //where appear this console log?
  console.log("NEW CONNECTION!", socket.id);

  //when new user connect to the whiteboard can see the previous drawings, so we need to store the already drawn pictures
  strokes.forEach(function (draw) {
    socket.emit("newDraw", draw.start, draw.end, draw.color); //the server is the one who draws
  });

  // 2) receive the data of the current draw and save to strokes var
  // all the users can see this
  socket.on("ownDraw", function (start, end, color) {
    strokes.push({ start, end, color }); //store the values
    // 3) send to newDraw the data of the drawing
    socket.broadcast.emit("newDraw", start, end, color); // Broadcasting means sending a message to everyone else except for the socket that starts it.
  });

  socket.on("disconnect", function () {
    console.log("USER DISCONNECTED");
  });
});
