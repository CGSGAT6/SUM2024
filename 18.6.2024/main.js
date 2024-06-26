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
let bullets = [];

const interval = 50;

wss.on("connection", async (ws) => {
  ws.send(JSON.stringify({
    type:"hist",
    poses:players,
    id:counter,
  }));

  ws.id = counter;

  for (const s of wss.clients) {
    let msg = {
      type:"connect",
      id:counter,
      valid:true,
    };

    s.send(JSON.stringify(msg));
  }

  players.push({
    pos:vec3(0),
    id:counter,
    valid:true,
  })

  counter++;
  ws.on("message", (message) => {
    let msg = JSON.parse(message.toString());
    if (msg.type == "move") {
      players[msg.id].pos = players[msg.id].pos.addVec(msg.move);
    } else if (msg.type == "bulletAdd") {
      bullets.push({
        startPos:vec3(msg.pos),
        pos:vec3(msg.pos),
        dir:vec3(msg.dir),
        playerId:msg.id,
      })

      for (const s of wss.clients) {
        s.send(JSON.stringify(msg));
      }
    }
  });

  
  ws.on("close", (code, data) => {
    //console.log('CLIENT DISCONNECTED: ', ws.id)
    players[ws.id].valid = false;
    for (const s of wss.clients) {
      let msg = {
        type:"disconnect",
        id:ws.id,
      };
  
      s.send(JSON.stringify(msg));
    }
  });
});

setInterval(() => {
  let poses = [];

  let startInd = 0;

  players.forEach((p) => {
    poses.push(p.pos);
  })

  for (let b in bullets) {
    bullets[b].pos = vec3(bullets[b].pos).addVec(vec3(bullets[b].dir).mulNum(interval / 1000 * 10));
    let len = bullets[b].pos.subVec(bullets[b].startPos).len();
    if (len > 20)
      bullets[b] = null;
  }
  
  bullets.forEach((bul) => {
    if (bul == null) {
      startInd++;
    }
  });
  
  bullets = bullets.slice(startInd);

  for (const s of wss.clients) {
    s.send(
      JSON.stringify({
        type:"update",
        pos:poses,
        inter:interval,
        bullets:bullets,
        startInd:startInd,
      }    
    ));
  }
}, interval);

const host = "localhost";
const port = 3030;

server.listen(port, host, () => {
  console.log(`AT6 server started on ${host}:${port}`);
});
