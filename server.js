const express = require("express");

const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

mongoose.set("strictQuery", false);
const Comments = require("./models/comments");
const Likes = require("./models/likes");
const Dislikes = require("./models/dislikes");

const commentRoute = require("./routes/comment");
const usersRoute = require("./routes/users");
const likeRoute = require("./routes/likes");
const dislikeRoute = require("./routes/dislikes");

const port = process.env.PORT || 8100;

app.use(cors);

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.fjx9wan.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content,Accept,Content-Type,Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //send comments to the client
  socket.on("getComments", () => {
    Comments.find()
      .sort({ createdAt: -1 })
      .then((comment) => {
        // console.log("comments : ", comment);
        socket.emit("receiveComments", comment);
      })
      .catch((error) => socket.emit("receiveComments", error));
  });

  //get comments from the client
  socket.on("commentSend", (comment) => {
    console.log("commentaires : ", comment);
    const comments = new Comments(comment);
    comments.save().then(() => socketIO.emit("commentResponse", comment));
  });

  //send likes to the client
  socket.on("getLikes", () => {
    Likes.find()
      .sort({ createdAt: -1 })
      .then((like) => {
       
        socket.emit("receiveLikes", like);
      })
      .catch((error) => socket.emit("receiveLikes", error));
  });

  //get likes from the client
  socket.on("likeSend", (like) => {
    console.log("likes : ", like);
    const likes = new Likes(like);
    likes.save().then(() => socketIO.emit("likeResponse", like));
  });

  //get deleted like from the client

  //send dislikes to the client
  socket.on("getDislikes", () => {
    Dislikes.find()
      .sort({ createdAt: -1 })
      .then((like) => {
        // console.log("likess : ", like);
        socket.emit("receiveDislikes", like);
      })
      .catch((error) => socket.emit("receiveDislikes", error));
  });

  //get dislikes from the client
  socket.on("dislikeSend", (like) => {
    console.log("dislikes : ", like);
    const dislikes = new Dislikes(like);
    dislikes.save().then(() => socketIO.emit("dislikeResponse", like));
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.use(express.json());
app.use("/api/comment", commentRoute);
app.use("/api/users", usersRoute);
app.use("/api/like", likeRoute);
app.use("/api/dislike", dislikeRoute);

http.listen(port, () => {
  console.log(`Server listening on port ${port} `);
});
