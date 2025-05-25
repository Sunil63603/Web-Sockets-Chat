import express from "express"; //to create server.
import http from "http"; //this protocol is used to access web-pages.
import { Server } from "socket.io"; //to sync frontend and backend in realTime.
import cors from "cors"; //allows frontend to talk with backend while browser tries to prevent this by default.
import dotenv from "dotenv"; //this is used to load environment variables in backend
import connectToDB from "./src/utils/db"; //used to connect to MongoDB database.

//imports all 3 major routes.
import userRoutes from "./src/routes/user.routes";
import chatRoutes from "./src/routes/chat.routes";
import messageRoutes from "./src/routes/message.routes";

//configure "dotenv".
dotenv.config();

const FRONTEND_PORT = process.env.FRONTEND_PORT;

//'http' - phone(only low-level communication)
//'express()' - mobile app(makes calls,messages easier)
//'socket.io' - chat app that lets both people talk at the same time(real time).

//server created by express(), is not full real server.It is just used to create routes
const app = express(); //create express app/server.
const server = http.createServer(app); //create http server using express server.
const io = new Server(server, {
  //create socket server using http server.
  cors: {
    //origin:'*',allow all origins for now.
    origin: `http://localhost:${FRONTEND_PORT}`, //❌Do i need to change this while deploying.❌
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

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

//'io' is the Socket.io server instance
//'on' means listen to an eve
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  //Join chat room.
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  //send message to others in the room.
  socket.on("send-message", (messageData) => {
    io.to(messageData.chatId).emit("receive-message", messageData);
  });

  //Typing indicator.
  socket.on("typing", (chatId: string) => {
    socket.in(chatId).emit("typing", socket.id);
  });

  //when someone stops typing.
  socket.on("stop-typing", (chatId: string) => {
    socket.in(chatId).emit("stop-typing", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;

//start server.
server.listen(BACKEND_PORT, () => {
  console.log(`Server running on http://localhost:${BACKEND_PORT}`);
});
