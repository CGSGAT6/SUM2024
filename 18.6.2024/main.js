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

let hist = [];

const interval = 50;

wss.on("connection", async (ws) => {
  ws.send(JSON.stringify({
    type:"hist",
    arr:hist,
    poses:players,
    id:counter,
  }
  ));

  for (const s of wss.clients) {
    let msg = {
      type:"connect",
      count:counter,
    };
    hist.push(msg);

    players.push({
      pos:vec3(counter),
      id:counter,
    })

    s.send(JSON.stringify(msg));
  }
  counter++;
  ws.on("message", (message) => {
    //console.log(message.toString()
    let msg = JSON.parse(message.toString());
    if (msg.type == "move") {
      players[msg.id].pos = players[msg.id].pos.addVec(msg.move);
    }
    // for (const s of wss.clients) {
    //   s.send(message.toString());
    // }
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