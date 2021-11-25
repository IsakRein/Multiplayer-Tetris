const Game = require("./Game")
const http = require('http');
const websocket = require('websocket');

class Server {
  constructor(port) {
    const httpServer = http.createServer();
    httpServer.listen(port);
    console.log("Started server on port " + port + ".");

    this.server = new websocket.server({ httpServer: httpServer })
    this.server.on('request', (request) => this.userConnect(request));

    this.clients = {};
    this.games = {};
    this.usernames = {};
    this.id = 0;

    this.queue = [];
  }

  userConnect(request) {
    var userId = this.getUniqueId();
    console.log("Connected user " + userId + " from " + request.origin + ".");

    const connection = request.accept(null, request.origin);

    connection.on("message", (str_message) => {
      const message = JSON.parse(str_message.utf8Data);
      this.handleMessage(message);
    })

    connection.on("close", () => {
      this.userDisconnect(userId);
    })

    this.clients[userId] = connection;

    this.sendMessage(
      userId,
      "connect",
      userId
    )
  }

  userDisconnect(userId) {
    console.log("Disconnected " + userId);

    if (this.queue.includes(userId)) {
      this.queue = this.queue.filter((element) => {
        return element != userId;
      })
      delete this.clients[userId];
    } 
    else if (this.clients.hasOwnProperty(userId)) {
      const otherUserId = this.games[userId].userId1 === userId ? this.games[userId].userId2 : this.games[userId].userId1

      this.games[userId].gameActive = false;
      
      delete this.games[userId];
      delete this.games[otherUserId];
      
      this.sendMessage(otherUserId, "disconnect", "");

      this.matchUser(otherUserId);
      
      delete this.clients[userId];
    }
  }

  handleMessage(message) {
    switch (message.type) {
      case "move":
        if (Object.keys(this.games).includes(message.id.toString())) {
          this.games[message.id].handleMessage(message);
        }
        break;
      case "disconnect":
        this.userDisconnect(message.id);
        break;
      case "username":
        this.usernames[message.id] = message.value;
        this.matchUser(message.id);
        break;
    }

    // this.sendMessageToAll("print", "message from server");
  }

  sendMessage(user, type, value) {
    const message = {
      type: type,
      value: value
    }

    this.clients[user].send(JSON.stringify(message));
  }

  sendMessageToAll(type, value) {
    for (const user in this.clients) {
      this.sendMessage(user, type, value)
    }
  }

  getUniqueId() {
    this.id++;
    return this.id;
  }

  matchUser(userId) {
    if (this.queue.length > 0) {
      this.createGame(this.queue[0], userId);
      this.queue.pop(0);
    }

    else {
      this.queue.push(userId);
    }
  }

  createGame(user1, user2) {
    console.log("Created game between: " + user1 + " and " + user2);

    this.sendMessage(user1, "matched", {id: user2, username: this.usernames[user2]});
    this.sendMessage(user2, "matched", {id: user1, username: this.usernames[user1]});

    const game = new Game(this, user1, user2);

    this.games[user1] = game;
    this.games[user2] = game;
  }
}

module.exports = Server;