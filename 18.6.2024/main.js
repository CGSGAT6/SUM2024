import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { vec3 } from "./client/math/vec3.js";

const app = express();

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

let counter = 0;

let players = [];

const interval = 50;

wss.on("connection", async (ws) => {
  ws.send(JSON.stringify({
    type:"hist",
    poses:players,
    id:counter,
  }));

  for (const s of wss.clients) {
    let msg = {
      type:"connect",
      id:counter,
    };

    s.send(JSON.stringify(msg));
  }

  players.push({
    pos:vec3(0),
    id:counter,
  })

  counter++;
  ws.on("message", (message) => {
    let msg = JSON.parse(message.toString());
    if (msg.type == "move") {
      players[msg.id].pos = players[msg.id].pos.addVec(msg.move);
    }
    });
});

setInterval(() => {
  let poses = [];

  players.forEach((p) => {
    poses.push(p.pos);
  })

  for (const s of wss.clients) {
    s.send(
      JSON.stringify({
        type:"update",
        pos:poses,
        inter:interval,
      }    
    ));
  }
}, interval);

const host = "localhost";
const port = 3030;

server.listen(port, host, () => {
  console.log(`AT6 server started on ${host}:${port}`);
});