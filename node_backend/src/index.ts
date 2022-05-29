import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routers from "./routers/index";
import connectDB from "./config/connect";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string);
const app = express();
app.use("/static", express.static("static"));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
routers(app);
connectDB();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
    // path: "/test/",
});
io.on("connection", (socket: Socket) => {
    socket.on("test-data", (data) => {
        console.log(data);
    });
});

server.listen(PORT);
