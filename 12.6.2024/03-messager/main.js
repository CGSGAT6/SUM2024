import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import express from "express";
import { WebSocketServer } from "ws";
import { MongoClient } from "mongodb";
import { count } from "node:console";

const app = express();

let startCount;
let counter = 0;

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

//let allMessages = [];

async function main() {
  const url = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(url);
  const database = "AT6Chat";
  const result = await client.connect();
  const db = result.db(database);
  const collection = db.collection("Messages");

  startCount = (await collection.find({}).toArray()).length;

  wss.on("connection", async (ws) => {
    let msgs = await collection.find({}).toArray();

    let msgHistory = {
      type: "hist",
      msgs: new Array(msgs),
      nO: counter++,
    };

    ws.send(JSON.stringify(msgHistory));

    ws.on("message", (message) => {
      let txt = JSON.parse(message.toString());

      if (txt.type == "msg") {
        txt.number = startCount + counter++;
        //allMessages.push(JSON.stringify(txt));
        collection.insertOne(txt);

        for (let s of wss.clients) {
          s.send(JSON.stringify(txt));
        }
      }
    });
  });
}

main();

const host = "localhost";
const port = 4747;

server.listen(port, host, () => {
  console.log(`AT6 server started on ${host}:${port}`);
});
