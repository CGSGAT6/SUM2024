import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

let counter = 0;

app.get("/", (req, res, next) => {
  counter++;
  console.log(counter);
  next();
});

app.use(express.static("client"));

app.get("/seeData", (req, res, next) => {
  res.send(`Data: ${counter}`);
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("A: " + message.toString());
    ws.send(`Client get message: ${message}, from you`);
  });

  ws.send(`Hi, we get new client! #${counter}`);
});

const host = "localhost";
const port = 4747;

server.listen(port, host, () => {
  console.log(`AT6 server started on ${host}:${port}`);
});
