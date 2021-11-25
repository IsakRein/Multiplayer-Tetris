const Board = require("./Board")

class Game {
  constructor(server, userId1, userId2) {
    this.gameActive = true;
    this.server = server;
    this.userId1 = userId1;
    this.userId2 = userId2;

    this.currentDelay = 1000;

    this.board1 = new Board(this, userId1, 10, 20, this.currentDelay);
    this.board2 = new Board(this, userId2, 10, 20, this.currentDelay);
  }

  sendMessage(type, value) {
    if (this.gameActive) {
      this.server.sendMessage(this.userId1, type, value)
      this.server.sendMessage(this.userId2, type, value)
    }
  }

  updateEntireBoard(type, userId, blockPositions){
    if(this.gameActive){
      const value = {
        oldBlockPositions: blockPositions,
        userId: userId
      };
      this.sendMessage(type, value)
    }
  }

  speedUp() {
    this.currentDelay = 1000;
    // if (this.currentDelay > 300) {
    //   this.currentDelay -= 50;
    // }
    

    // this.board1.delay = 300;
    // this.board1.resetUpdate();
    // this.board2.delay = 300;
    // this.board2.resetUpdate();
  }

  sendMessageToOtherBoard(userId, type, value) {
    if (this.gameActive) {
      var otherUser = this.userId1;
      if (userId == this.userId1) {
        otherUser = this.userId2;
      }
      const message = {
        id: otherUser,
        type: type,
      }
      this.handleMessage(message);
    }
  }

  handleMessage(message) {
    if (message.id == this.userId1) {
      this.board1.handleMessage(message);
    }
    else if (message.id == this.userId2) {
      this.board2.handleMessage(message);
    }
  }

  gameOver() {
    console.log("gameover")
    this.board1.gameactive = false;
    this.board2.gameactive = false;
  }
}

module.exports = Game;