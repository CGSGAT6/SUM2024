import http from "node:http";
import express from "express";
import { WebSocketServer } from "ws";
import { vec3 } from "./client/math/vec3.js";
import { MongoClient } from "mongodb";

const app = express();

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

let counter = 0;

let players = [];
let validNames = [];
let bullets = [];

let leaders = {};
let lastLeaderboardUpdate = -1; 


const interval = 50;
async function main() {
  const url = "mongodb+srv://doadmin:x62jNC54Pi1W3t98@db-mongodb-pml30-2024-12312526.mongo.ondigitalocean.com/admin?tls=true&authSource=admin";
  const client = new MongoClient(url);
  const database = "PML30-2024-J";
  const result = await client.connect();
  const db = result.db(database);
  const collection = db.collection("AT6Shooter");

  wss.on("connection", async (ws) => {
    ws.on("message", async (message) => {
      let msg = JSON.parse(message.toString());
      if (msg.type == "connection") {
        if (players[msg.newName] != undefined) {
          ws.send(JSON.stringify({
            type:"NameError",
          }));
          ws.terminate();
        } else {
          let newName = msg.newName;
          
          let poses = [];

          const date = new Date();
          let t =
            date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;

          for (let p of validNames){
            if (players[p] != undefined)
              poses.push(players[p]);
          };

          ws.send(JSON.stringify({
            type:"hist",
            poses:poses,
            id:counter,
            name:newName,
          }));

          let playerData = await collection.find({name:newName}).toArray();
          let kills = 0;
          let deads = 0;
          if (playerData[0] != undefined)
            kills = playerData[0].kills, deads = playerData[0].deads;
          else
            collection.insertOne({
              name:newName,
              kills:0,
              deads:0,
            });
          ws.id = counter;
          ws.name = newName;
          for (const s of wss.clients) {
            let msg = {
              type:"connect",
              id:counter,
              valid:true,
              name:newName,
              kills:kills,
              deads:deads,
            };

            s.send(JSON.stringify(msg));
          }

          players[newName] = {
            pos:vec3(0),
            id:counter,
            valid:true,
            name:newName,
            state:"active",
            kills:kills,
            deads:deads,
            isChanged:false,
            deadTime:-3,
            health:3,
            startTime:t,
          };

          validNames.push(newName);


          counter++;
          
        }
      } else if (msg.type == "move") {
        let newPos = players[msg.name].pos.addVec(msg.move);

        if (newPos.x > 10)
          newPos.x = 10;
        if (newPos.x < -10)
          newPos.x = -10;
        if (newPos.y > 10)
          newPos.y = 10;
        if (newPos.y < -10)
          newPos.y = -10;
        players[msg.name].pos = newPos;
      } else if (msg.type == "getLeaders") {
        const date = new Date();
        let t =
          date.getMinutes() * 60 +
          date.getSeconds() +
          date.getMilliseconds() / 1000;

        if (t - lastLeaderboardUpdate < 1) {
          ws.send(JSON.stringify({
            type:"leaderboard",
            leaders:leaders,
          }));
          return;
        }

        leaders = [];
        for (let n of validNames) {
          if (players[n] != undefined) {
            leaders.push({
              name:n,
              kills:players[n].kills,
              deads:players[n].deads,
              time:players[n].startTime,
            });
          }
        }

        leaders.sort((a, b) => {
          return (b.kills - b.deads) - (a.kills - a.deads);
        });

        leaders = leaders.slice(0, 10);

        ws.send(JSON.stringify({
          type:"leaderboard",
          leaders:leaders,
        }));
        lastLeaderboardUpdate = t;
      } else if (msg.type == "bulletAdd") {
        bullets.push({
          startPos:vec3(msg.pos),
          pos:vec3(msg.pos),
          dir:vec3(msg.dir),
          playerId:msg.id,
          name:msg.name,        
        })

        for (const s of wss.clients) {
          s.send(JSON.stringify(msg));
        }
      }
    });

    
    ws.on("close", (code, data) => {
      if (ws.name == undefined)
        return;
      //console.log('CLIENT DISCONNECTED: ', ws.id)
      for (const s of wss.clients) {
        let msg = {
          type:"disconnect",
          id:ws.id,
          name:ws.name,
        };

        s.send(JSON.stringify(msg));
      };

      let idx = validNames.indexOf(ws.name);
      validNames.splice(idx, 1);

      collection.replaceOne(
        {
          name:ws.name
        },
        {
          name:ws.name,
          kills:players[ws.name].kills,
          deads:players[ws.name].deads,
        });
      delete players[ws.name];
    
    });
  });

  setInterval(() => {
    const date = new Date();
    let t =
      date.getMinutes() * 60 +
      date.getSeconds() +
      date.getMilliseconds() / 1000;

    let kills = [];
    let poses = [];

    let startInd = 0;

    let collis = [[]];

    for (let p of validNames){
      if (players[p] != undefined) {
        let yy = Math.trunc(players[p].pos.y);
        let xx = Math.trunc(players[p].pos.x);
        if (collis[yy] == undefined)
          collis[yy] = [];
        if (collis[yy][xx] == undefined)
          collis[yy][xx] = [];
        collis[yy][xx].push(players[p]);
      }
    };

    for (let b in bullets) {
      if (bullets[b]) {
        bullets[b].pos = vec3(bullets[b].pos).addVec(vec3(bullets[b].dir).mulNum(interval / 1000 * 10));
        let len = bullets[b].pos.subVec(bullets[b].startPos).len();
        if (len > 20)
          bullets[b] = null;    
        else {
          let xx = Math.trunc(bullets[b].pos.x);
          let yy = Math.trunc(bullets[b].pos.y);
          if (collis[yy] == undefined)
            continue;
          if (collis[yy][xx] == undefined || collis[yy][xx] == [])
            continue;

          for (let i in collis[yy][xx]) {
            let curPlayer = collis[yy][xx][i];
            if (curPlayer.name != bullets[b].name) {
              let d2 = bullets[b].pos.subVec(curPlayer.pos).len2();

              if (d2 < 0.47 * 0.47 / 2) {
                if (-curPlayer.deadTime + t > 6 && t - players[bullets[b].name].deadTime > 6) {
                  curPlayer.health -= 1;
                  players[bullets[b].name].isDamaged = true;

                  if (curPlayer.health <= 0) {
                    curPlayer.health = 3;
                    curPlayer.deads += 1;
                    curPlayer.isDead = true;
                    curPlayer.pos = vec3(0);
                    players[bullets[b].name].kills += 1;
                    players[bullets[b].name].isKill = true;
                    curPlayer.deadTime = t;
                  }
                }
                bullets[b] = null;
                break;
              }
            }
          }
          /*
          for (let n of validNames) {
            if (players[n] != undefined && players[n].name != bullets[b].name) {
              let d2 = bullets[b].pos.subVec(players[n].pos).len2();

              if (d2 < 0.47 * 0.47 / 2) {
                if (-players[n].deadTime + t > 6 && t - players[bullets[b].name].deadTime > 6) {
                  players[n].health -= 1;
                  players[bullets[b].name].isDamaged = true;

                  if (players[n].health <= 0) {
                    players[n].health = 3;
                    players[n].deads += 1;
                    players[n].isDead = true;
                    players[n].pos = vec3(0);
                    players[bullets[b].name].kills += 1;
                    players[bullets[b].name].isKill = true;
                    players[n].deadTime = t;
                  }
                }
                bullets[b] = null;
                break;
              }
            }
          }*/
        }
      }
    }
    
    bullets.forEach((bul) => {
      if (bul == null) {
        startInd++;
      }
    });
    
    bullets = bullets.slice(startInd);

    for (let p of validNames){
      if (players[p] != undefined)
        poses.push(players[p]);
    };


    for (const s of wss.clients) {
      if (s.name == undefined)
        continue;
      s.send(
        JSON.stringify({
          type:"update",
          players:poses,
          inter:interval,
          bullets:bullets,
          startInd:startInd,
        }    
      ));


      players[s.name].isDead = false;
      players[s.name].isKill = false;
      players[s.name].isDamaged = false;
    }
  }, interval);

  const host = "localhost";
  const port = 3030;

  server.listen(port, host, () => {
    console.log(`AT6 server started on ${host}:${port}`);
  });
}

main();