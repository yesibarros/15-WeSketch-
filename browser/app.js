//----- CLIENT -----//
// Nunca viste window.location antes?
// Este objeto describe el URL de la página en la que estamos.
const socket = io(window.location.origin); // TIP: io() with no args does auto-discovery the server.

/*
spread operator: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Spread_operator
function f(x, y, z) { }
const args = [0, 1, 2];
f(...args);
*/

// remember whiteboard is a global variable alocated in windows object
// 1) draw and send to socket the data, before showing anything
whiteboard.on("draw", function (...draw) {
  socket.emit("ownDraw", ...draw);
});

//4) Getting the data of the drawing of the server and draw in the whiteboard
socket.on("newDraw", function (...draw) {
  console.log("Estoy recibiendo data del server");
  whiteboard.draw(...draw);
});

socket.on("connect", function () {
  // where appear this console log?
  console.log("Tengo hecho una conexión persistente bilateral al servidor!");
});
