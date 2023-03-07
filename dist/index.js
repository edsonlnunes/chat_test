"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const node_crypto_1 = require("node:crypto");
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => res.status(200).json("OK"));
const server = app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
const socket = new ws_1.Server({
    server,
    verifyClient: (info, success) => {
        console.log(info.origin);
        console.log(info.secure);
        success(true);
    },
});
const users = [];
socket.on("connection", (channel, req) => {
    console.log("== CONECTOU ==");
    users.push({
        id: (0, node_crypto_1.randomUUID)(),
        ws: channel,
    });
    channel.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log(message);
            for (const user of users) {
                user.ws.send(JSON.stringify(message));
            }
        }
        catch (error) {
            console.log("erro ao converter json");
        }
    });
    channel.on("error", (error) => {
        console.log(error);
    });
});
