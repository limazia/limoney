require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const { errors } = require("celebrate");

const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let connectedUsers = {};

io.on('connection', (socket) => {
  connectedUsers[socket.id] = socket;

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
  });
});

app.use((request, response, next) => {
  request.io = io;
  return next();
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);
app.use(errors());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

const port = process.env.APP_PORT || 3333;
server.listen(port, () => {
  console.log(`[app.js] > Server running in ${process.env.APP_URL}`);
});