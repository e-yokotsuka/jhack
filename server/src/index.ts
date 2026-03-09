import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { DungeonRoom } from "./rooms/DungeonRoom";

const PORT = Number(process.env.PORT ?? 2567);
const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });

gameServer.define("dungeon", DungeonRoom);

// Colyseus 監視UI (開発用) http://localhost:2567/colyseus
app.use("/colyseus", monitor());

httpServer.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(` jhack multiplayer server`);
    console.log(` Listening on ws://localhost:${PORT}`);
    console.log(` Monitor: http://localhost:${PORT}/colyseus`);
    console.log(`===========================================`);
});
