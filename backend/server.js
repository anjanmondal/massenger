require("dotenv").config({path:'./.env'});
const express = require('express');
const path = require('path');
const { createServer } = require('node:http');
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const { Server } = require('socket.io');
const  cors = require('cors')
const userRoute = require("./src/routes/userRoute")
const messageRoute = require("./src/routes/messageRoute")
const app = express();
const cookieParser = require("cookie-parser")
const server = createServer(app);
const db = require("./src/db/db")
const io = new Server(server,{
  cors: { origin: "http://localhost:5173",credentials:true }
});
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/user",userRoute)
app.use("/api/messages",messageRoute)


// Serve frontend static files
if (process.env.NODE_ENV === 'production') {
  // Points to massenger/frontend/dist
  app.use(express.static(path.join(__dirname, '../frontend/dist'))); 

  // Directs all routing traffic back to your fresh index.html page
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}
let onlineUsers = {};

io.on("connection", (socket) => {
 

  socket.on("addUser", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, image }) => {
    const receiverSocket = onlineUsers[receiverId];

     if (receiverSocket) {
      io.to(receiverSocket).emit("getMessage", {
        senderId,
        text,
        image,
        createdAt: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

db();
server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
