import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws) => {
  ws.on("message", (message) => {
    //console.log(message.toString())

    for (const s of wss.clients) {
      s.send(message.toString());
    }
    });
});

const host = "localhost";
const port = 3030;

server.listen(port, host, () => {
  console.log(`AT6 server started on ${host}:${port}`);
});
