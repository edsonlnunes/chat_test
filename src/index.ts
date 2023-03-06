import express from "express";
import cors from "cors";
import { Server } from "ws";
import { randomUUID } from "node:crypto";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).json("OK"));

const server = app.listen(process.env.PORT || 3000, () =>
  console.log("Server running...")
);

const socket = new Server({
  server,
  verifyClient: (info, success) => {
    console.log(info.origin);
    console.log(info.secure);
    success(true);
  },
});

const users = [] as any[];

socket.on("connection", (channel, req) => {
  console.log("== CONECTOU ==");

  users.push({
    id: randomUUID(),
    ws: channel,
  });

  channel.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(message);

      for (const user of users) {
        user.ws.send(JSON.stringify(message));
      }
    } catch (error) {
      console.log("erro ao converter json");
    }
  });

  channel.on("error", (error) => {
    console.log(error);
  });
});
