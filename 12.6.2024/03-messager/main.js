import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

let counter = 0;

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

let allMessages = [];

wss.on("connection", (ws) => {
  let msgHistory = {
    type: "hist",
    msgs: new Array(...allMessages),
    nO: counter++,
  };

  ws.send(JSON.stringify(msgHistory));

  ws.on("message", (message) => {
    let txt = JSON.parse(message.toString());

    if (txt.type == "msg") {
      txt.number = allMessages.length;
      allMessages.push(JSON.stringify(txt));

      for (let s of wss.clients) {
        s.send(JSON.stringify(txt));
      }
    }
  });
});

const host = "localhost";
const port = 4747;

server.listen(port, host, () => {
  console.log(`AT6 server started on ${host}:${port}`);
});
