import express from "express"; //to create server.
import http from "http"; //this protocol is used to access web-pages.
import { Server } from "socket.io"; //to sync frontend and backend in realTime.
import cors from "cors"; //allows frontend to talk with backend while browser tries to prevent this by default.
import dotenv from "dotenv"; //this is used to load environment variables in backend

import { Message } from "./src/models/Message"; //this is used(to create a message) while user sends a new message.
import { Chat } from "./src/models/Chat"; //this is also used(while pushing message into particular chat)

import mongoose from "mongoose";
import connectToDB from "./src/utils/db"; //used to connect to MongoDB database.

//imports all 3 major routes.
import userRoutes from "./src/routes/user.routes";
import chatRoutes from "./src/routes/chat.routes";
import messageRoutes from "./src/routes/message.routes";

//configure "dotenv".
dotenv.config();

const FRONTEND_URL = process.env.VITE_FRONTEND_URL;

//'http' - phone(only low-level communication)
//'express()' - mobile app(makes calls,messages easier)
//'socket.io' - chat app that lets both people talk at the same time(real time).

//server created by express(), is not full real server.It is just used to create routes
const app = express(); //create express app/server.
const server = http.createServer(app); //create http server using express server.
const io = new Server(server, {
  //create socket server using http server.
  cors: {
    // origin: "*", // ❌ Remove this in production
    // ✅ Replace with your actual deployed frontend URL:
    origin: "https://web-sockets-chat-roan.vercel.app",
    methods: ["GET", "POST"],
  },
});
//All these days, i was not importing http.
//But now socket.io needs server created using http.
//express server doesnt give low-level access, hence http server is used

//applying middleware
app.use(cors());
app.use(express.json()); //JSON requests are automatically parsed to strings in case of requests.
//thats why req.json()❌ res.json()✅
//bcoz of this, server can understand incoming request which helps in SEO.

//connect to MongoDB database.
connectToDB();

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected!");
});

console.log(mongoose.connection.name);

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

//'io' is the Socket.io server instance
//'on' means listen to an eve
io.on("connection", (socket) => {
  console.log("User connected to this socket", socket.id);

  //Join chat room.
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  //send message to others in the room.
  socket.on("send-message", async ({ chatId, content, userId }) => {
    try {
      //1.Create message in 'messages' collection.
      const newMessage = await Message.create({
        chatId,
        sender: userId,
        content,
      });

      //2. Push message to messages[] of chats collection.
      await Chat.findByIdAndUpdate(chatId, {
        $push: { messages: newMessage._id },
        $set: { latestMessage: newMessage._id },
      });

      //3.emit back to all clients in room.
      io.to(chatId).emit("receive-message", newMessage);
    } catch (error) {
      console.log("Error sending message", error);
    }
  });

  //Typing indicator.
  socket.on("typing", (chatId: string) => {
    socket.in(chatId).emit("typing", socket.id);
  });

  //when someone stops typing.
  socket.on("stop-typing", (chatId: string) => {
    socket.in(chatId).emit("stop-typing", socket.id);
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });
});

const BACKEND_PORT = process.env.VITE_BACKEND_PORT || 5000;

//start server.
server.listen(BACKEND_PORT, () => {
  console.log(`Server running on ${process.env.VITE_BACKEND_URL}`);
});
