import "./b.js";

console.log("CGSG Forever!");

function initializeCommunication() {
  let socket = new WebSocket("ws://localhost:4747");

  socket.onopen = (event) => {
    console.log("Socket open");
    socket.send("Client connected");
  };

  socket.onmessage = (event) => {
    console.log(`Message received ${event.data}`);
  };
}

initializeCommunication();
