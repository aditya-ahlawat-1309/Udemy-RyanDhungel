import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";


const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
    allowedHEADERS: ["Content-type"],
  },
});

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR => ", err));

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// autoload routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// // socket.io
// io.on("connect", (socket) => {
//   // console.log("SOCKET>IO", socket.id)
//   socket.on("send-message", (message) => {
//     //console.log("new message received => ", message);
//   socket.broadcast.emit("receive-message", message);
//   })
// });

// socket.io
io.on("connect", (socket) => {
  // console.log("SOCKET>IO", socket.id)
  socket.on("new-post", (newPost) => {
    //console.log("new message received => ", message);
  socket.broadcast.emit("newPost", newPost);
  })
});

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server running on port ${port}`));
