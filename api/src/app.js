import express, { urlencoded } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.18:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Import Routes
import userRouter from "./routes/user.routes.js";
import { Socket } from "dgram";
import { Chat } from "./models/chat.model.js";

//Routes
app.use("/api/v1/user", userRouter);

io.on("connection", (socket) => {
  console.log("User Connected!");
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      console.log("Data", data);

      const newMessage = new Chat({ sesenderId, receiverId, message });

      await newMessage.save();

      // Emit message to receiver
      socket.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Error handling message. ", error);
    }
    socket.on("disconnect", () => {
      console.log("User Disconnected!");
    });
  });
});

server.listen(3000, () => {
  console.log(`Socket.io is running on port 3000`);
});

export default app;
